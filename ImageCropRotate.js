import React, { Component } from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import { getCroppedImg, getRotatedImg } from './cropRotateUtils';
import { defaultImage } from './defaultImage.jpeg';
import ImageWindow from './ImageWindow';

export default class ImageCropRotate extends Component {
	state = {
		imagePreviewUrl: ""
	}

	onImageLoaded = (image) => {
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
            originalImgWidth: image.naturalWidth,
            originalImgHeight: image.naturalHeight
        });
    }

    handleImageChange = (e) => {
	    e.preventDefault();

	    let reader = new FileReader();
	    let file = e.target.files[0];

	    reader.onloadend = () => {
			this.setState({
				file,
				imagePreviewUrl: reader.result
			});
	    }

	    reader.readAsDataURL(file)
	}

    onChange = (crop, pixelCrop) => {
        this.setState({
            crop, 
            height: pixelCrop.height,
            width: pixelCrop.width,
            x: pixelCrop.x,
            y: pixelCrop.y
        });
    }

	render() {
		return (
			<div>
				<ImageWindow 
					backgroundImage={this.state.imagePreviewUrl}
				/>

				<form onSubmit={(e)=>this.handleSubmit(e)}>
	              	<label>
	              		Choose Image
		                <input
	                      type="file"
	                      accept="image/*"
	                      onChange={(e)=>this.handleImageChange(e)}
	                    />
		            </label>
	          	</form>

	          	<div>
                  <ReactCrop
                      onChange={this.onChange}
                      onImageLoaded={this.onImageLoaded}
                      crop={this.state.crop}
                      src={this.state.imagePreviewUrl}
                  />
              </div>
          	</div>
		)
	}
}
