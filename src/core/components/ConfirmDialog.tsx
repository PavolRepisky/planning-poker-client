import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { ReactComponent as ConfirmSvg } from 'assets/confirm.svg';
import SvgContainer from 'core/components/SvgContainer';
import { useTranslation } from 'react-i18next';

type ConfirmDialogProps = {
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  pending: boolean;
  title: string;
};

const ConfirmDialog = ({
  description,
  onClose,
  onConfirm,
  open,
  pending,
  title,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogContent sx={{ textAlign: 'center' }}>
        <SvgContainer>
          <ConfirmSvg style={{ maxWidth: 280, width: '100%' }} />
        </SvgContainer>

        <DialogTitle id="confirm-dialog-title" sx={{ p: 0, my: 1 }}>
          {title}
        </DialogTitle>

        {description && (
          <DialogContentText id="confirm-dialog-description">
            {description}
          </DialogContentText>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <LoadingButton
          autoFocus
          onClick={onConfirm}
          loading={pending}
          variant="contained"
        >
          {t('common.confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
