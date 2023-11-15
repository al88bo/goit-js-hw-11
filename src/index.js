import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.headers.common['key'] = '40697905-03a35d5cf8bc79d8acf92618e';

const form = document.querySelector('.search-form');
const input = form.firstElementChild;
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
let page = 1;
const per_page = 40;
