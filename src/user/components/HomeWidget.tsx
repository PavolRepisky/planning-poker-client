import { Card, CardContent, CardHeader, Typography } from '@mui/material';

type WidgetProps = {
  svg: React.ReactNode;
  title: string;
  subTitle: string;
  onClick?: () => void;
};

const HomeWidget = ({ svg, title, subTitle, onClick }: WidgetProps) => {
  return (
    <Card
      sx={{
        height: 270,
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <CardHeader title={title} />
      <CardContent sx={{ pt: 0 }}>
        <Typography component="div" sx={{ fontWeight: 300, mb: 3 }}>
          {subTitle}
        </Typography>
        {svg}
      </CardContent>
    </Card>
  );
};

export default HomeWidget;
