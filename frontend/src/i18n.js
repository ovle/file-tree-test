import i18next from 'i18next';
import ru from './static/locale/ru';

i18next.init({
    interpolation: {
        // React already does escaping
        escapeValue: false
    },
    lng: 'ru',
    resources: {
        ru
    }
});

export default i18next;