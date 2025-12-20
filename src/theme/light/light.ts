import { type GlobalThemeOverrides } from 'naive-ui';

export function lightThemeOverrides(): GlobalThemeOverrides {
  return {
    common: {
      baseColor: '#fff',
      // primary color
      primaryColor: '#18a058',
      primaryColorHover: '#36ad6a',
      primaryColorPressed: '#0c7a43',
      primaryColorSuppl: '#36ad6a',
      // info color
      infoColor: '#2080f0',
      infoColorHover: '#4098fc',
      infoColorPressed: '#1060c9',
      infoColorSuppl: '#4098fc',
      // success color
      successColor: '#18a058',
      successColorHover: '#36ad6a',
      successColorPressed: '#0c7a43',
      successColorSuppl: '#36ad6a',
      // warning color
      warningColor: '#f0a020',
      warningColorHover: '#fcb040',
      warningColorPressed: '#c97c10',
      warningColorSuppl: '#fcb040',
      // error color
      errorColor: '#d03050',
      errorColorHover: '#de576d',
      errorColorPressed: '#ab1f3f',
      errorColorSuppl: '#de576d'
    }
  };
}
