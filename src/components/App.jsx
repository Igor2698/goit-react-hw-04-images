import { useEffect, useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import SearchBar from './SearchBar';
import ImageGallery from './ImageGallery';
import Section from './Section';

import { getImage } from 'servises/image-api';
import Button from './Button';
import Modal from './Modal';
import EmptyValue from './EmptyValue';

import { ImagePendingView } from './ImagePendingView';
import TextErrorView from './TextErrorView';

const Status = {
  IDLE: 'idle',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [endOfImages, setEndOfImages] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageForModal, setImageForModal] = useState('');

  useEffect(() => {
    if (query !== '') {
      async function getImages() {
        try {
          setEndOfImages(false);
          setIsLoading(true);
          const newImages = await getImage(query, page);
          setImages(prev => [...prev, ...newImages.hits]);
          setStatus(Status.RESOLVED);
          setIsLoading(false);

          if (page === 1 && newImages.totalHits > 0) {
            toast.success(`Cool! We found ${newImages.totalHits} images`);
          }

          const totalPages = Math.ceil(newImages.totalHits / 12);

          if (
            (newImages.totalHits !== 0 && newImages.totalHits < 12) ||
            (totalPages !== 0 && page >= totalPages)
          ) {
            toast.warning(
              `We are sorry but you have reached the end of images`
            );
          }

          if (newImages.totalHits < 12 || page >= totalPages) {
            setEndOfImages(true);
          }

          if (newImages.totalHits === 0) {
            toast.warning(`No images found with name ${query}`);
          }
        } catch (error) {
          setError(error);
          setStatus(Status.REJECTED);
        }
      }

      getImages();
    }
  }, [query, page]);

  const handleSearchBarSubmit = queryObj => {
    const newQuery = queryObj.query;

    if (newQuery.trim() === '') {
      return toast.error('Please enter value of image');
    }

    if (newQuery === query) {
      return toast.warning(
        `Meaning: ${query} Has already been found.  Please repeat your request`
      );
    }
    setQuery(newQuery);
    setPage(1);
    setImages([]);
  };

  const onLoadMoreClick = () => {
    setPage(prev => prev + 1);
  };

  const toggleModal = imageForModal => {
    setShowModal(prev => !prev);
    setImageForModal(imageForModal);
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Section>
        <SearchBar onSubmit={handleSearchBarSubmit}></SearchBar>
        {status === 'idle' && <EmptyValue></EmptyValue>}
      </Section>

      {isLoading && <ImagePendingView />}

      {status === 'rejected' && <TextErrorView message={error.message} />}

      {status === 'resolved' && (
        <Section>
          <ImageGallery onImgClick={toggleModal} images={images} />

          {showModal && (
            <Modal onClose={toggleModal} image={imageForModal}></Modal>
          )}
          {!endOfImages && <Button onClick={onLoadMoreClick}></Button>}
        </Section>
      )}
    </>
  );
};
