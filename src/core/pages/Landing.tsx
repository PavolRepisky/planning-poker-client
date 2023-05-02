import { Star as StarIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Feature from 'core/components/Feature';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import JoinSessionModal from 'session/components/JoinSessionModal';
import LandingLayout from '../components/LandingLayout';

const listFeatures = [
  { name: 'landing.features.unlimitedSessions' },
  { name: 'landing.features.unlimitedUsers' },
  { name: 'landing.features.unlimitedVotings' },
  { name: 'landing.features.noPersonalDetails' },
];

const Landing = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openJoinModal, setOpenJoinModal] = useState(false);

  return (
    <LandingLayout>
      <main>
        <Box
          sx={{
            py: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              variant="h1"
              align="center"
              color="text.primary"
              marginBottom={4}
            >
              {t('landing.title')}
            </Typography>

            <Stack
              sx={{ pt: 3 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="outlined" onClick={() => setOpenJoinModal(true)}>
                {t('landing.join')}
              </Button>
            </Stack>
          </Container>
        </Box>

        {openJoinModal && (
          <JoinSessionModal
            onClose={() => setOpenJoinModal(false)}
            open={openJoinModal}
          />
        )}

        <Container sx={{ py: 6 }} maxWidth="md">
          <img
            alt="Application demo"
            src={`images/placeholder.png`}
            style={{
              borderRadius: 24,
              borderStyle: 'solid',
              borderWidth: 6,
              borderColor: theme.palette.background.default,
              width: '100%',
            }}
          />
        </Container>

        <Container sx={{ py: 8 }} maxWidth="lg">
          <Stack alignItems="center" spacing={5}>
            <Feature
              title="landing.features.builder.title"
              description="landing.features.builder.description"
              rightAlign={false}
              imageSrc="images/placeholder.png"
              imageAlt="Card deck builder showcase"
            />
            <Feature
              title="landing.features.realTime.title"
              description="landing.features.realTime.description"
              rightAlign={true}
              imageSrc="images/placeholder.png"
              imageAlt="Real time estimation showcase deck builder showcase"
            />
            <Feature
              title="landing.features.inGameVoting.title"
              description="landing.features.inGameVoting.description"
              rightAlign={false}
              imageSrc="images/placeholder.png"
              imageAlt="In-game voting showcase"
            />
            <Feature
              title="landing.features.cardDeckManagement.title"
              description="landing.features.cardDeckManagement.description"
              rightAlign={true}
              imageSrc="images/placeholder.png"
              imageAlt="In-game voting showcase"
            />
          </Stack>
        </Container>

        <Container sx={{ pt: 5 }} maxWidth="md">
          <Stack alignItems="center">
            <Typography
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {t('landing.features.noLimits')}
            </Typography>

            <List sx={{ pt: 3 }}>
              {listFeatures.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>
                      <StarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={t(feature.name)} />
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', mt: 5 }}>
              <Button
                component="a"
                href={process.env.REACT_APP_API_SOURCE_LINK}
                rel="noopener noreferrer"
                target="_blank"
                variant="outlined"
                sx={{ mr: 2 }}
              >
                {t('landing.links.api')}
              </Button>
              <Button
                component="a"
                href={process.env.REACT_APP_CLIENT_SOURCE_LINK}
                rel="noopener noreferrer"
                target="_blank"
                variant="outlined"
              >
                {t('landing.links.client')}
              </Button>
            </Box>
          </Stack>
        </Container>
      </main>
    </LandingLayout>
  );
};

export default Landing;
