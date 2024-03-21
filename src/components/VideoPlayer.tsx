import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import {styles} from './styles';

const VideoPlayer: React.FC = (props: any) => {
  const {navigation, route} = props;
  const {params} = route;
  const {selectedVideo} = params;

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.videoPlayerHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/back.png')}
            resizeMode="contain"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.vPHeaderText}>Video Player</Text>
        <View style={styles.empty} />
      </View>

      <View style={styles.videoNameWrapper}>
        <Text style={styles.videoNameText}>
          <Text style={styles.videoName}>Name:</Text> {selectedVideo?.name}{' '}
        </Text>
      </View>

      <View style={styles.videoWrapper}>
        {selectedVideo.name && (
          <Video
            source={{
              uri: `${RNFS.LibraryDirectoryPath}/media/${selectedVideo.name}`,
            }}
            resizeMode="contain"
            style={styles.video}
            controls
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default VideoPlayer;
