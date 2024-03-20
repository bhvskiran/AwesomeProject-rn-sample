import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {PERMISSIONS, request} from 'react-native-permissions';
// import RNFetchBlob from 'rn-fetch-blob';
const fs = require('fs');
import ytdl from 'react-native-ytdl';

const MainScreen = () => {
  const [inputVal, setInputVal] = useState<string>('');
  const vodeoUrl = 'https://www.youtube.com/watch?v=a3ICNMQW7Ok';
  const downloadUrl =
    'https://rr3---sn-a5mekn6d.googlevideo.com/videoplayback?expire=1710926706&ei=Elf6Za_RGtLGsfIP_umXkA4&ip=184.170.252.133&id=o-AAAj7dfXeWkt7lxsKS40kDjpcfeszYL8q1xB6a6VNHgI&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=E9&mm=31%2C29&mn=sn-a5mekn6d%2Csn-a5msenl7&ms=au%2Crdu&mv=m&mvi=3&pl=24&initcwndbps=2212500&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=30.209&lmt=1673725034527642&mt=1710904412&fvip=1&c=ANDROID&txp=4432434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRgIhAId5MZSwnoENntBUrsb7eeZivvYRqnINk9rAD_BVaa5ZAiEA96VrNN5kXN6WQsdqxyBGpO8TAqCsHqy3D4FemvjPK5s%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=ALClDIEwRgIhAPNuU25Z_Mvdq8a93wfp04_QtIGoiBDQv9bk1Swe7C-jAiEAqZwg8JWogNGLC9AjQwGGJREvhkfXl7yx44swgs1Apy8%3D&title=Wildlife%20Windows%207%20Sample%20Video';

  const requestMediaPermission = async () => {
    try {
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
      const response = await ytdl.getInfo(inputVal);
      const format = await ytdl.chooseFormat(response.formats, {quality: '18'});
      const videoName = response?.videoDetails?.title;
      const videoUrl = format.url;

      console.log('videoName', videoName, 'videoUrl', videoUrl);

      // console.log('response sk', response);
      // const {config, fs} = RNFetchBlob;
      // const fileDir = fs.dirs.DownloadDir;
      // const fileName = 'video ' + new Date() + '.mp4';
      // const filePath = `${fileDir}/${fileName}`;
      // console.log('fileName', fileName);

      // const response = await config({
      //   fileCache: true,
      //   path: filePath,
      //   appendExt: '.mp4',
      // })
      //   .fetch('GET', inputVal)
      //   .progress((received, total) => {
      //     console.log('progress', received / total);
      //   })
      //   .then(res => {
      //     // the temp file path
      //     console.log('The file saved to ', res.path());
      //     RNFetchBlob.ios.openDocument(res.path());
      //   });

      // console.log('finalll', response);

      // config({
      //   // add this option that makes response data to be stored as a file,
      //   // this is much more performant.
      //   fileCache: true,
      //   IOSBackgroundTask: true,
      // })
      //   .fetch('GET', inputVal, {
      //     //some headers ..
      //   })
      //   .progress((received, total) => {
      //     console.log('progress', received / total);
      //   })
      //   .then(res => {
      //     // the temp file path
      //     console.log('The file saved to ', res.path());
      //   });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={styles.mainWrapper}>
      <Text style={styles.logo}>My Videos</Text>
      <View style={styles.inputWrap}>
        <TextInput
          value={inputVal}
          onChangeText={(text: string) => setInputVal(text)}
          style={styles.inputStyle}
          placeholder="Enter / Paste your URL"
        />
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => requestMediaPermission()}>
          <Text style={styles.downloadText}>DOWNLOAD</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  mainWrapper: {
    margin: 20,
    flex: 1,
  },
  logo: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'blue',
  },
  inputWrap: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    width: '100%',
    fontSize: 22,
    paddingHorizontal: 10,
  },
  downloadBtn: {
    backgroundColor: '#cecece',
    paddingHorizontal: 20,
    margin: 10,
    paddingVertical: 12,
    borderRadius: 5,
  },
  downloadText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
