import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth()
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: res.photos.photo});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({galleryWidth: this.getGalleryWidth()});
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  deleteImageHandle(i) {
    const newImages = this.state.images.slice(0);
    newImages.splice(i,1);
    this.setState({images: newImages});
  }

  render() {
    const {images, galleryWidth} = this.state;
    return (
      <div className="gallery-root">
        {images.map((dto, i) => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={galleryWidth} i={i} deleteImage={() => this.deleteImageHandle(i)}/>;
        })}
      </div>
    );
  }
}

export default Gallery;
