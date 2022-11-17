import "styled-components";
import theme from "@theme/index";

declare module 'style-components'{
  type ThemeType = typeof theme;

  export interface DefaultTheme extends ThemeType{}
}