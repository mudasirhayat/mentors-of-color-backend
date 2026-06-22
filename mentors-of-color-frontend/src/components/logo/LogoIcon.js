// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 * import { ThemeMode } from 'config';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="Mantis" width="100" />
     *
     */
    <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
d="M 7.27577 57.2242 L 17.5616 46.9384 L 17.5724 46.9276 H 36.9234 L 29.2238 54.
      />
      <path
        d="M19.3509 64.5L27.2357 56.6152L29.2236 54.6273L21.5267 46.9276H17.5722L17.5615 46.9384L7.27561 57.2242L17.1483 67.0487L19.3509 64.5Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M101.762 56.6152L109.649 64.5L108.868 65.2807L108.871 65.2834L119.5 55.0002L111.438 46.9384L111.428 46.9276H110.644L101.206 56.0572L101.762 56.6152Z"
        fill="url(#paint1_linear)"
      />
      <path
const pathData = "M17.5508 46.9276 L17.5615 46.9384 L27.2357 56.6152 L64.4999 93.8767 L111.449
<linearGradient id="gradient">
  <stop stopColor={theme.palette.primary.darker} />
  <stop offset="0.9637" stopColor={theme.palette.primary.dark} stopOpacity="0" />
</linearGradient>
        <linearGradient id="paint1_linear" x1="103.5" y1="49.5" x2="114.5" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor={theme.palette.primary.darker} />
          <stop offset="1" stopColor={theme.palette.primary.dark} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LogoIcon;
