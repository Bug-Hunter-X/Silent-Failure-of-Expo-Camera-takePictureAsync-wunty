This solution uses `Camera.getStatusAsync` to check the camera's status before calling `takePictureAsync`. It waits for the camera to be ready and uses an async/await pattern for better readability and error handling.

```javascript
import * as React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';

// ... other imports

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleTakePicture = async () => {
    if (!cameraReady) {
      console.warn('Camera not ready yet');
      return;
    }
    if (hasPermission) {
      let photo = await cameraRef.current.takePictureAsync();
      console.log('Photo taken:', photo);
    }
  };

  const handleCameraReady = async () => {
    const status = await cameraRef.current.getStatusAsync();
    setCameraReady(status.isRecording === false && status.recording === false && status.recordingIsPrepared === false);
  };

  const cameraRef = React.useRef(null);
  if (hasPermission === null) {
    return <View><Text>Requesting permissions...</Text></View>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef} onCameraReady={handleCameraReady}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleTakePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </Pressable>
        </View>
      </Camera>
    </View>
  );
}
```