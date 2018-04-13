import React, { Component } from 'react';
import { View, Text, ActivityIndicator,TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'
import {Icon} from 'native-base';
import Gallery from 'react-native-image-gallery';
//utils 
import Colors from '../utils/Colors';

export default class ImageGallery extends Component {
    static propsType = {
      onClose: PropTypes.func,
      images: PropTypes.array
    }



    constructor (props) {
        super(props);
        this.state = {
            index: 0,
        };
        this.onChangeImage = this.onChangeImage.bind(this);

        // this.addImages();
        // this.removeImages();
        // this.removeImage(2, 3000);
    }

    addImages () {
        // Debugging helper : keep adding images at the end of the gallery.
        setInterval(() => {
            const newArray = [...this.props.images, { source: { uri: 'http://i.imgur.com/DYjAHAf.jpg' } }];
            this.setState({ images: newArray });
        }, 5000);
    }

    removeImage (slideIndex, delay) {
        // Debugging helper : remove a given image after some delay.
        // Ensure the gallery doesn't crash and the scroll is updated accordingly.
        setTimeout(() => {
            const newArray = this.props.images.filter((element, index) => index !== slideIndex);
            this.setState({ images: newArray });
        }, delay);
    }

    removeImages () {
        // Debugging helper : keep removing the last slide of the gallery.
        setInterval(() => {
            const { images } = this.state;
            // console.log(images.length);
            if (images.length <= 1) {
                return;
            }
            const newArray = this.props.images.filter((element, index) => index !== this.props.images.length - 1);
            this.setState({ images: newArray });
        }, 2000);
    }

    onChangeImage (index) {
        this.setState({ index });
    }

    renderError () {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                 <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>This image cannot be displayed...</Text>
                 <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>... but this is fine :)</Text>
            </View>
        );
    }

    get caption () {
        const { index } = this.state;
        const {images} = this.props; 
        return (
            <View style={{ bottom: 0, height: 65, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'space-around',alignItems:'center',flexDirection:'row' }}>
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, fontStyle: 'italic' }}>{ (images[index] && images[index].caption) || '' } </Text>
                <TouchableOpacity style={{marginLeft: 10}} onPress={this.props.onClose.bind(this)}>
                  <Icon name="md-close" style={{fontSize: 25,color:Colors.main_white}}/>
                </TouchableOpacity>
            </View>
        );
    }

    get galleryCount () {
        const { index } = this.state;
        const {images} = this.props; 
        return (
            <View style={{ top: 0, height: 65, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'center' }}>
                <Text style={{ textAlign: 'right', color: 'white', fontSize: 15, fontStyle: 'italic', paddingRight: '10%' }}>{ index + 1 } / { images.length }</Text>
            </View>
        );
    }

    render () {
        return (
            <View style={{ flex: 1,position: 'relative' }} >
                <Gallery
                  style={{flex: 1, backgroundColor: '#696969'}}
                  images={this.props.images}
                  errorComponent={this.renderError}
                  onPageSelected={this.onChangeImage}
                  initialPage={0}
                />
                { this.galleryCount }
                { this.caption }
            </View>
        );
    }
}