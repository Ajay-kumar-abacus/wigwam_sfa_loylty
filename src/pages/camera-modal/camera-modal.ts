import { Component, NgZone } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview';
import { Diagnostic } from '@ionic-native/diagnostic';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-camera-modal',
  templateUrl: 'camera-modal.html',
})
export class CameraModalPage {

  cameraFacing: string = 'rear';
  flashMode: 'off' | 'on' | 'auto' = 'off';
  selectImage: string[] = [];
  footer: number = 0;
  unregisterBackButton: any;
  type: any;
  isCameraActive: boolean = false;
  isProcessing: boolean = false;

  constructor(
    private cameraPreview: CameraPreview,
    private camera: Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private platform: Platform,
    public diagnostic: Diagnostic,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private ngZone: NgZone
  ) {
    this.type = this.navParams.get("type");
  }

  ionViewDidLoad() {
    // Add small delay to ensure view is fully loaded
    setTimeout(() => {
      if (this.type == 'camera') {
       this.startCamera()
      } else {
        this.openGallery();
      }
    }, 100);
  }

  ionViewWillLeave() {
    // Ensure camera is stopped when leaving
    if (this.isCameraActive) {
      this.cameraPreview.stopCamera().catch(() => {});
    }
  }

  ionViewDidLeave() {
    // Clean up resources
    this.selectImage = [];
    this.isCameraActive = false;
    this.isProcessing = false;
  }

  dismiss() {
    if (this.isProcessing) {
      return; // Prevent dismissal during processing
    }

    if (this.isCameraActive) {
      this.cameraPreview.stopCamera()
        .then(() => {
          this.isCameraActive = false;
          this.viewCtrl.dismiss();
        })
        .catch(() => {
          // Force dismiss even if camera stop fails
          this.isCameraActive = false;
          this.viewCtrl.dismiss();
        });
    } else {
      this.viewCtrl.dismiss();
    }
  }

  async startCamera() {
    if (this.isCameraActive) {
      return; // Prevent multiple starts
    }

    const options: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: Math.floor(window.screen.height * 0.72), // Use floor to avoid decimal pixels
      camera: this.cameraFacing,
      tapPhoto: false,
      previewDrag: false,
      toBack: false,
      alpha: 1,
      disableExifHeaderStripping: false
    };

    try {
      // First ensure camera is stopped
      await this.cameraPreview.stopCamera().catch(() => {});
      
      // Small delay to ensure cleanup
      await this.delay(100);
      
      // Start camera
      await this.cameraPreview.startCamera(options);
      this.isCameraActive = true;
      
      // Set initial flash mode
      this.updateFlashMode();
    } catch (err) {
      console.error('Error starting camera:', err);
      this.showCameraError();
    }
  }

  async toggleCamera() {
    if (!this.isCameraActive || this.isProcessing) {
      return;
    }

    try {
      this.isProcessing = true;
      this.cameraFacing = this.cameraFacing === 'rear' ? 'front' : 'rear';
      await this.cameraPreview.switchCamera();
    } catch (error) {
      console.error('Error switching camera:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  toggleFlashMode() {
    if (!this.isCameraActive || this.isProcessing) {
      return;
    }

    // Cycle through flash modes
    switch(this.flashMode) {
      case 'off':
        this.flashMode = 'on';
        break;
      case 'on':
        this.flashMode = 'auto';
        break;
      case 'auto':
      default:
        this.flashMode = 'off';
        break;
    }
    
    this.updateFlashMode();
  }

  updateFlashMode() {
    if (!this.isCameraActive) {
      return;
    }

    try {
      switch(this.flashMode) {
        case 'on':
          this.cameraPreview.setFlashMode('on');
          break;
        case 'auto':
          this.cameraPreview.setFlashMode('auto');
          break;
        case 'off':
        default:
          this.cameraPreview.setFlashMode('off');
          break;
      }
    } catch (error) {
      console.error('Error setting flash mode:', error);
    }
  }

  async capturePhoto() {
    if (!this.isCameraActive || this.isProcessing) {
      return;
    }

    const loading = this.loadingCtrl.create({
      content: 'Processing photo...',
      duration: 5000 // Auto dismiss after 5 seconds as fallback
    });

    try {
      this.isProcessing = true;
      loading.present();

      const pictureOpts: CameraPreviewPictureOptions = {
        width: 1280,
        height: 720,
        quality: 85
      };

      const imageData = await this.cameraPreview.takePicture(pictureOpts);
      
      // Process image in NgZone to ensure UI updates
      this.ngZone.run(async () => {
        // Optimize base64 handling
        const base64Image = 'data:image/jpeg;base64,' + imageData;
        this.selectImage = [base64Image]; // Reset array instead of push
        
        // Stop camera
        if (this.isCameraActive) {
          await this.cameraPreview.stopCamera().catch(() => {});
          this.isCameraActive = false;
        }
        
        loading.dismiss();
        this.sendData();
      });
    } catch (err) {
      console.error('Error taking picture:', err);
      loading.dismiss();
      this.showCaptureError();
    } finally {
      this.isProcessing = false;
    }
  }

  async openGallery() {
    if (this.isProcessing) {
      return;
    }

    const loading = this.loadingCtrl.create({
      content: 'Loading photo...',
      duration: 10000 // Auto dismiss after 10 seconds as fallback
    });

    const options: CameraOptions = {
      quality: 85, // Reduced from 100 for better performance
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetWidth: 1280, // Add size limits
      targetHeight: 1280
    };

    try {
      this.isProcessing = true;
      loading.present();
      
      const imageData = await this.camera.getPicture(options);
      
      // Process in NgZone
      this.ngZone.run(() => {
        const base64Image = 'data:image/jpeg;base64,' + imageData;
        this.selectImage = [base64Image];
        loading.dismiss();
        this.sendData();
      });
    } catch (err) {
      console.error('Error opening gallery:', err);
      loading.dismiss();
      
      if (err !== 'No Image Selected' && err !== 20) { // User cancelled
        this.showGalleryError();
      } else {
        this.dismiss();
      }
    } finally {
      this.isProcessing = false;
    }
  }

  sendData() {
    if (this.selectImage.length > 0) {
      // Clean up before sending
      const imageToSend = this.selectImage[0];
      this.selectImage = []; // Clear array to free memory
      this.viewCtrl.dismiss(imageToSend);
    } else {
      this.viewCtrl.dismiss();
    }
  }

  // Helper methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private showCameraError() {
    const alert = this.alertCtrl.create({
      title: 'Camera Error',
      message: 'Unable to access camera. Please try again.',
      buttons: ['OK']
    });
    alert.present();
  }

  private showCaptureError() {
    const alert = this.alertCtrl.create({
      title: 'Capture Error',
      message: 'Failed to capture photo. Please try again.',
      buttons: ['OK']
    });
    alert.present();
  }

  private showGalleryError() {
    const alert = this.alertCtrl.create({
      title: 'Gallery Error',
      message: 'Unable to access gallery. Please try again.',
      buttons: ['OK']
    });
    alert.present();
  }
}