import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PERMISSIONS, request} from 'react-native-permissions';
import ytdl from 'react-native-ytdl';
import RNFS from 'react-native-fs';
import CustomLoader from './CustomLoader';
import {styles} from './styles';

const MainScreen: React.FC = (props: any) => {
  const {navigation} = props;
  const [inputVal, setInputVal] = useState<string>('');
  const [filesList, setFilesList] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    readFiles();
  }, []);

  const requestMediaPermission = async () => {
    try {
      Keyboard.dismiss();
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      const result2 = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
      if (result === result2 && result === 'granted') {
        downloadFile();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = async () => {
    try {
      setLoader(true);
      const validator =
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
      const isValidate = validator.test(inputVal);
      if (!isValidate) {
        setLoader(false);
        setShowError(true);
        return;
      }
      const response = await ytdl.getInfo(inputVal);
      const format = await ytdl.chooseFormat(response.formats, {quality: '18'});
      setInputVal('');
      const videoName = response?.videoDetails?.title;
      const videoUrl = format.url;
      const fileName = `${videoName}.mp4`;
      const filePath = `${RNFS.LibraryDirectoryPath}/media/${fileName}`;

      const options = {
        fromUrl: videoUrl,
        toFile: filePath,
        background: true,
        discretionary: true,
        progress: (res: any) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Progress: ${progress.toFixed(2)}%`);
        },
      };
      const isExists = await RNFS.exists(filePath);
      if (!isExists) {
        const res = await RNFS.downloadFile(options).promise.then(response => {
          readFiles();
        });
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const readFiles = () => {
    const directoryPath = `${RNFS.LibraryDirectoryPath}/media/`;

    RNFS.readdir(directoryPath)
      .then(files => {
        const newFiles = files.map((value: string, index: number) => ({
          name: value,
          id: index,
        }));
        setFilesList(newFiles);
      })
      .catch(error => {
        console.log('Error reading directory:', error);
      });
  };

  const deleteFile = async (item: any) => {
    try {
      const filePath = `${RNFS.LibraryDirectoryPath}/media/${item.name}`;
      await RNFS.unlink(filePath);
      readFiles();
    } catch (err: any) {
      Alert.alert(`Error deleting file "${item.name}": ${err?.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <CustomLoader showLoader={loader} />
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{margin: 20}}>
            <Text style={styles.logo}>My Videos</Text>
            <View style={styles.inputWrap}>
              <TextInput
                value={inputVal}
                onChangeText={(text: string) => setInputVal(text)}
                onFocus={() => setShowError(false)}
                style={styles.inputStyle}
                placeholder="*Enter / Paste your Youtube URL"
              />
              {showError && (
                <Text style={styles.errorText}>
                  *Not a valid URL, please check
                </Text>
              )}
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => requestMediaPermission()}>
                <Text style={styles.downloadText}>DOWNLOAD</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.hLine} />
            <Text style={styles.subhead}>Downloaded Videos</Text>

            <FlatList
              data={filesList}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                return (
                  <View style={styles.fileCard}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('video', {selectedVideo: item})
                      }>
                      <Text style={styles.delBtn}>PLAY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteFile(item)}>
                      <Text style={styles.delBtn}>DEL</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MainScreen;
