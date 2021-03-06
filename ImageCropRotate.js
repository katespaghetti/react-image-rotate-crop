import React from 'react'
import ReactDOM from 'react-dom'
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { getCroppedImg, getRotatedImg } from './cropRotateUtils';
import { defaultImage } from './defaultImage.jpeg';

export default class ImageCropRotate extends React.Component {
	state = {
		file: "",
        imagePreviewUrl: null,
        newImageUrl: null,
        imagePickerUrl: '',
        rotationDegrees: 0,
        hidden: true,
        defaultImage: false
	}

	getImageStateAndProps = () => {
        return ({
            ...this.state,
            imagePreviewUrl: this.state.imagePickerUrl
        })
    }

	onImageLoaded = (image) => {
    	console.log("loaded")
    	this.rotate(this.state.rotationDegrees);
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

	handleSubmit = (e) => {
	    console.log("in the submit");
	}

    handleImageChange = (e) => {
	    e.preventDefault();

	    let reader = new FileReader();
	    let file = e.target.files[0];

	    console.log("what is reader.result", reader.result)

	    reader.onloadend = () => {
			this.setState({
				file,
				imagePreviewUrl: reader.result
			});
	    }

	    reader.readAsDataURL(file)
	}

	updateImageRotation = (rotationDegrees) => {
        this.setState({
            rotationDegrees: (this.state.rotationDegrees + rotationDegrees) % 360
        });

        this.props.rotateImageCallback(rotationDegrees);
    };

    rotate = (rotationDegrees) => {
        const { originalImgWidth, originalImgHeight, imagePreviewUrl } = this.state;

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

	getBackgroundImage = () => {
    	if (this.state.defaultImage != true) {
            const style = {
                backgroundImage: `url(${this.state.newImageUrl})`
            }

            return style;
        }
    }

	render() {
		const { crop, hidden } = this.state;
		console.log("this is the state", this.state);

		return (
			<div>
				<form onSubmit={(e)=>this.handleSubmit(e)}>
	              	<label>
	              		Choose Image
		                <input
	                      type="file"
	                      accept="image/*"
	                      onChange={(e)=>this.handleImageChange(e)} 
	                      className="" />
		            </label>
	          	</form>


                  { !hidden &&

                      <div className="button-container">
                          <button onClick={() => this.updateImageRotation(-90)}>
                              <i className="fa fa-rotate-left" />
                              Rotate left
                          </button>

                          <button onClick={() => this.updateImageRotation(90)}>
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
                      src={this.state.imagePreviewUrl}
                      keepSelection={true}
                  />
              </div>
          	</div>
		)
	}
}