import React, { Component } from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import { getCroppedImg, getRotatedImg } from './cropRotateUtils';

export default class ImageCropRotate extends Component {
    state = {
        hiddenButtons: true,
        newImage: null,
        imagePickerUrl: ''
    };

    getImageStateAndProps = () => {
        return ({
            ...this.state,
            imagePreviewUrl: this.state.imagePickerUrl
        })
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
            hidden: false,
            originalImgWidth: image.naturalWidth,
            originalImgHeight: image.naturalHeight
        });

        getCroppedImg({
            ...this.getImageStateAndProps(),
            ...data,
            // degrees: this.props.profileInfo.rotationDegrees
            },
            true,
            (dataUrl) => {
                // this.props.updateProfileImage(dataUrl);
                this.setState({
                    newImage: dataUrl
                })
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
                // this.props.updateProfileImage(dataUrl)
                this.setState({
                    newImage: dataUrl
                })
            }
        );
    }

    toggleImageUploadPanel = () => {
        this.setState({
            ...this.state,
            hidden: !this.state.hidden,
            imagePickerUrl: '',
            newImage: null 
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // const { uploadProfileImage, settings, profileInfo, toggleImageUploadPanel, uploadProfileImageButtonClick } = this.props;

        const { uploadProfileImage, settings, profileInfo, toggleImageUploadPanel } = this.props;

        getCroppedImg({
                ...this.getImageStateAndProps(),
                degrees: profileInfo.rotationDegrees
            },
            false,
            (croppedImgBlob) => {
                // uploadProfileImage(api, settings.communityServiceUrl, croppedImgBlob);
                // toggleImageUploadPanel();
            }
        )

        // uploadProfileImageButtonClick();
    }

    handleImageChange = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            // this.props.setProfileImageUrl(reader.result);
            this.setState({
                imagePickerUrl: reader.result,
                hiddenButtons: !this.state.hiddenButtons
            })
        }

        reader.readAsDataURL(file)
    }

    rotate = (rotationDegrees) => {
        const {originalImgWidth, originalImgHeight, imagePreviewUrl, imagePickerUrl } = this.state;

        getRotatedImg(
            {
                imagePreviewUrl: imagePickerUrl,
                width: originalImgWidth,
                height: originalImgHeight,
                degrees: this.props.profileInfo.rotationDegrees + rotationDegrees
            },
            (dataUrl) => {
                // this.props.setProfileImageUrl(dataUrl);
                this.setState({
                    imagePickerUrl: dataUrl
                })
            } 
        )
    }

    // edge will force a page refresh on cancel without this
    cancelImageUpload = (e) => {
        e.preventDefault();

        this.setState({
            ...this.state,
            newImage: null,
            hiddenButtons: true,
            rotationDegrees: 0,
            imagePickerUrl: ''
        })
    }

    render() {
        const { hiddenButtons, crop, newImage, imagePickerUrl } = this.state;

        const style = {
            width: 160,
            height: 160,
            minWidth: 160,
            overflow: "hidden",
            position: "relative",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            border: "1px solid #333",
            backgroundImage: `url(${newImage})`
        }

        console.log("this is the state", this.state);

        return (
            <div className="image-upload-panel">
                <div>
                    <div style={style} />
                </div>

                <div>
                    <div className="preview-component-container">
                        <h3><strong>Upload an image</strong></h3>

                        <form onSubmit={(e)=>this.handleSubmit(e)}>
                            <label>
                            Choose Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e)=>this.handleImageChange(e)}
                                />
                            </label>
                            <button 
                                type="submit" 
                                onClick={(e)=>this.cancelImageUpload(e)}>
                                Cancel
                            </button>

                            {!hiddenButtons && 
                                <button 
                                    type="submit" 
                                    onClick={(e)=>this.handleSubmit(e)}>
                                    Upload
                                </button>
                            }
                        </form>

                        { !hiddenButtons &&

                            <div>
                                <button onClick={()=>this.rotate(-90)}>
                                    <i className="fa fa-rotate-left" />
                                    Rotate left
                                </button>

                                <button onClick={()=>this.rotate(90)}>
                                    <i className="fa fa-rotate-right" />
                                    Rotate right
                                </button>
                            </div>
                        }

                        <div>
                            <ReactCrop
                                onChange={this.onChange}
                                onImageLoaded={this.onImageLoaded}
                                crop={crop}
                                src={imagePickerUrl}
                                keepSelection={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}