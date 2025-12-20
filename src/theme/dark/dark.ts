import { type GlobalThemeOverrides } from 'naive-ui';

export function darkThemeOverrides(): GlobalThemeOverrides {
  return {
    common: {
      baseColor: '#000',
      // primary color
      primaryColor: '#63e2b7',
      primaryColorHover: '#7fe7c4',
      primaryColorPressed: '#5acea7',
      primaryColorSuppl: 'rgb(42, 148, 125)',
      // info color
      infoColor: '#70c0e8',
      infoColorHover: '#8acbec',
      infoColorPressed: '#66afd3',
      infoColorSuppl: 'rgb(56, 137, 197)',
      // success color
      successColor: '#63e2b7',
      successColorHover: '#7fe7c4',
      successColorPressed: '#5acea7',
      successColorSuppl: 'rgb(42, 148, 125)',
      // warning color
      warningColor: '#f2c97d',
      warningColorHover: '#f5d599',
      warningColorPressed: '#e6c260',
      warningColorSuppl: 'rgb(240, 138, 0)',
      // error color
      errorColor: '#e88080',
      errorColorHover: '#e98b8b',
      errorColorPressed: '#e57272',
      errorColorSuppl: 'rgb(208, 58, 82)'
    }
  };
}
