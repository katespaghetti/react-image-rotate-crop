import React, { PureComponent } from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import { getCroppedImg, getRotatedImg } from './cropRotateUtils';
import { defaultImage } from './defaultImage.jpeg';

export default class ImageCropRotate extends PureComponent {
    state = {
      hidden: true,
      imageUrl: defaultImage,
      newImageUrl: null,
      rotationDegrees: 0,
      imagePickerUrl: '',
      defaultImage: true
    };

    getImageStateAndProps = () => {
        return ({
            ...this.state,
            imagePreviewUrl: this.state.imagePickerUrl
        })
    }

    onImageLoaded = (image) => {
    	console.log("loaded")
        const crop = 
            makeAspectCrop({
                x: 0,
                y: 0,
                aspect: 1,
                width: 50,
            }, image.width / image.height)

        // crop returns percentages of the image, converting for pixel use
        const data = {
            crop,
            width: Math.round(image.naturalWidth * (crop.width / 100)),
            height: Math.round(image.naturalHeight * (crop.height / 100))
        };

        this.setState({
            ...data,
            hidden: false,
            originalImgWidth: image.naturalWidth,
            originalImgHeight: image.naturalHeight
        });

        getCroppedImg({
            ...this.getImageStateAndProps(),
            ...data,
            degrees: this.state.rotationDegrees
            },
            true,
            (dataUrl) => {
                this.state.updateImage(dataUrl);
            }
        );
    }

    onChange = (crop, pixelCrop) => {
        this.setState({
            crop, 
            height: pixelCrop.height,
            width: pixelCrop.width,
            x: pixelCrop.x,
            y: pixelCrop.y
        });

        getCroppedImg(
            this.getImageStateAndProps(),
            true,
            (dataUrl) => {
                this.state.updateImage(dataUrl)
            }
        );
    }

    updateImageRotation = (rotationDegrees) => {
        this.setState({
            rotationDegrees: (this.state.rotationDegrees + rotationDegrees) % 360
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { settings, toggleImageUploadPanel, uploadImageButtonClick } = this.props;

        getCroppedImg({
                ...this.getImageStateAndProps(),
                degrees: this.state.rotationDegrees
            },
            false,
            (croppedImgBlob) => {
                // put the function that uploads the image here
                // or some ability for something else to happen when someone clicks upload
                toggleImageUploadPanel();
            }
        )

        uploadImageButtonClick();
    }

    handleImageChange = (e) => {
    	console.log("beep")
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({newImageUrl: reader.result});
        }

        reader.readAsDataURL(file)
    }

    rotate = (rotationDegrees) => {
        const {originalImgWidth, originalImgHeight, imagePreviewUrl } = this.state;

        getRotatedImg(
            {
                imagePreviewUrl: this.state.imagePickerUrl,
                width: originalImgWidth,
                height: originalImgHeight,
                degrees: this.state.rotationDegrees + rotationDegrees
            },
            (dataUrl) => {
                this.setState({newImageUrl: dataUrl});
            } 
        )
    }

    // edge will force a page refresh on cancel without this
    cancelImageUpload = (e) => {
        e.preventDefault();
        this.props.cancelImageUpload();
    }

    getBackgroundImage = () => {
    	if (this.state.defaultImage != true) {
            const style = {
                backgroundImage: `url(${this.state.newImageUrl})`
            }

            return style;
        }
    }

    render() {
        const { hidden, crop } = this.state;
        const { cancelImageUpload } = this.props;

        return (
            <div className="image-upload-panel">
              <div className="preview-component-container">
                  <h3><strong>Upload an image</strong></h3>

                  <form onSubmit={(e)=>this.handleSubmit(e)}>
                      <label className="input-styling rounded-blue-btn btn btn-default">
                      Choose Image
                          <input
                              type="file"
                              accept="image/*"
                              onChange={(e)=>this.handleImageChange(e)} 
                              className="choose-file-button" />
                      </label>
                      <button 
                          type="submit" 
                          onClick={(e)=>this.cancelImageUpload(e)}>
                          Cancel
                      </button>

                      {!hidden && 
                          <button 
                              type="submit" 
                              onClick={(e)=>this.handleSubmit(e)}>
                              Upload
                          </button>
                      }
                  </form>

                  { !hidden &&

                      <div className="button-container">
                          <button onClick={this.updateImageRotation(-90)}>
                              <i className="fa fa-rotate-left" />
                              Rotate left
                          </button>

                          <button onClick={this.updateImageRotation(90)}>
                              <i className="fa fa-rotate-right" />
                              Rotate right
                          </button>
                      </div>
                  }

                  <div className="image-preview-container" style={this.getBackgroundImage()}>
                      <ReactCrop
                          onChange={this.onChange}
                          onImageLoaded={this.onImageLoaded}
                          crop={crop}
                          src={this.state.imagePickerUrl}
                          keepSelection={true}
                      />
                  </div>
              </div>
            </div>
        )
    }
}
