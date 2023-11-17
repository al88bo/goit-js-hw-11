import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';

const form = document.querySelector('.search-form');
const input = form.firstElementChild;
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currPagesQuantity = 0;

const alertNotify = {
  params: {
    clickToClose: true,
    fontSize: '22px',
    timeout: 4000,
    width: '35vw',
    info: {
      background: 'rgb(255, 159, 42)',
    },
  },
  failure:
    'Sorry, there are no images matching your search query. Please try again.',
  info: "We're sorry, but you've reached the end of search results.",
  log(key, quantity) {
    if (quantity) this.success = `Hooray! We found ${quantity} images.`;
    Notify[key](this[key], this.params);
  },
};

const lightbox = new SimpleLightbox('.gallery-link', {
  captionsData: 'alt',
  captionDelay: 400,
});

axios.defaults.baseURL = 'https://pixabay.com/api/';
const axiosOptions = {
  params: {
    key: '40697905-03a35d5cf8bc79d8acf92618e',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
    page: undefined,
    q: undefined,
  },
};

form.addEventListener('submit', getImages);
loadMoreBtn.addEventListener('click', getLoadMoreImages);

// /
// /
// ============   F U N C T I O N S   ===============
// /
// /

async function getImages(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  if (!input.value) return alertNotify.log('failure');
  axiosOptions.params.q = input.value;
  axiosOptions.params.page = 1;
  try {
    const resp = await axios.get('', axiosOptions);
    if (!resp.data.totalHits) return alertNotify.log('failure');
    alertNotify.log('success', resp.data.totalHits);
    renderImages(resp);
    currPagesQuantity = Math.ceil(
      resp.data.totalHits / axiosOptions.params.per_page
    );
    swichLoadMoreBtn(resp);
  } catch (error) {
    alertNotify.log('failure');
  }
}

async function getLoadMoreImages() {
  try {
    axiosOptions.params.page++;
    const resp = await axios.get('', axiosOptions);
    renderImages(resp);
    scrollPage();
    swichLoadMoreBtn(resp);
    // if (loadMoreBtn.style.display === 'none') alertNotify.log('info');
  } catch (error) {
    alertNotify.log('failure');
  }
}

function swichLoadMoreBtn({ data: { totalHits } }) {
  loadMoreBtn.style.display =
    axiosOptions.params.page >= currPagesQuantity ||
    totalHits <= axiosOptions.params.per_page
      ? 'none'
      : 'block';
  if (loadMoreBtn.style.display === 'none') alertNotify.log('info');
}

function renderImages(axiosResp) {
  gallery.insertAdjacentHTML('beforeend', getMarkup(axiosResp.data.hits));
  lightbox.refresh();
}

function getMarkup(objectsArray) {
  return objectsArray
    .map(
      currObj => `<div class="photo-card">
      <a class="gallery-link" href="${currObj.largeImageURL}">
        <img
          class="gallery-link-image"
          src="${currObj.webformatURL}"
          alt="${currObj.tags}"
          loading="lazy"
          width="400"
      /></a>
      <div class="info">
        <p class="info-item"><b> Likes </b>${currObj.likes}</p>
        <p class="info-item"><b> Views </b>${currObj.views}</p>
        <p class="info-item"><b> Comments </b>${currObj.comments}</p>
        <p class="info-item"><b> Downloads </b>${currObj.downloads}</p>
      </div>
    </div>`
    )
    .join('');
}

function scrollPage() {
  const { height: divHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: divHeight * 2,
    behavior: 'smooth',
  });
}
