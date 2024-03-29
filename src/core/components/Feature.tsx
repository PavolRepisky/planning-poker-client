import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';

type FeatureProps = {
  title: string;
  description: string;
  rightAlign: boolean;
  imageSrc: string;
  imageAlt: string;
};

const TextItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Grid item xs={12} sm={5} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box>
        <Typography
          variant="h2"
          align="left"
          color="text.primary"
          marginBottom={2}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          fontWeight={'normal'}
          align="left"
          color="text.primary"
        >
          {description}
        </Typography>
      </Box>
    </Grid>
  );
};

const ImageItem = ({
  imageSrc,
  imageAlt,
}: {
  imageSrc: string;
  imageAlt: string;
}) => {
  const theme = useTheme();

  return (
    <Grid item xs>
      <img
        alt={imageAlt}
        src={imageSrc}
        style={{
          borderRadius: 24,
          borderStyle: 'solid',
          borderWidth: 4,
          borderColor: theme.palette.background.default,
          width: '100%',
        }}
      />
    </Grid>
  );
};

const Feature = ({
  title,
  description,
  rightAlign,
  imageSrc,
  imageAlt,
}: FeatureProps) => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {rightAlign && !isExtraSmall && (
        <>
          <ImageItem imageSrc={imageSrc} imageAlt={imageAlt} />
          <TextItem title={title} description={description} />
        </>
      )}

      {(!rightAlign || isExtraSmall) && (
        <>
          <TextItem title={title} description={description} />
          <ImageItem imageSrc={imageSrc} imageAlt={imageAlt} />
        </>
      )}
    </Grid>
  );
};

export default Feature;
