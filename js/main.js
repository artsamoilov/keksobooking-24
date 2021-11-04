import {map, initializeMap, setFilterEnabled, resetMap, compareAdverts, checkMapFilter, updateMapMarkers, filterAdverts} from './utils/map.js';
import {setAdFormSubmit, setFormEnabled, resetForm, setAdFormReset} from './utils/form.js';
import {showSuccessNotification, showErrorNotification} from './utils/notification.js';
import {loadAdverts} from './utils/api.js';
import {debounce} from './utils/debounce.js';

const MAX_OFFERS_COUNT = 10;
const RENDERER_DELAY = 500;

const setPageEnabled = (enabled) => {
  setFilterEnabled(enabled);
  setFormEnabled(enabled);
};

const onSuccess = () => {
  showSuccessNotification();
  resetMap();
  resetForm();
};

const onError = () => showErrorNotification();

const renderMap = (adverts) => {
  setPageEnabled(false);
  map.on('load', () => {
    setPageEnabled(true);
  });
  initializeMap(adverts.slice(0, MAX_OFFERS_COUNT));
  checkMapFilter(debounce(
    () => {updateMapMarkers(adverts
      .slice()
      .filter(filterAdverts)
      .sort(compareAdverts)
      .slice(0, MAX_OFFERS_COUNT));
    }, RENDERER_DELAY));
  setAdFormReset(adverts
    .slice()
    .sort(compareAdverts)
    .slice(0, MAX_OFFERS_COUNT));
  setAdFormSubmit(onSuccess, onError, adverts
    .slice()
    .sort(compareAdverts)
    .slice(0, MAX_OFFERS_COUNT));
};

loadAdverts(renderMap);
