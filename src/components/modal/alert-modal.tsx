'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useTranslations } from 'next-intl';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  description?: string;
}

export function AlertModal({ isOpen, onClose, onConfirm, loading, title, description }: AlertModalProps) {
  const t = useTranslations();
  const tileText = title || t('Modal.confirm.title');
  const descriptionText = description || t('Modal.confirm.description');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={tileText}
      description={descriptionText}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex w-full items-center justify-end space-x-2 pt-6'>
        <Button disabled={loading} variant='outline' onClick={onClose}>
          {t('Common.cancel')}
        </Button>
        <Button disabled={loading} variant='destructive' onClick={onConfirm}>
          {t('Common.continue')}
        </Button>
      </div>
    </Modal>
  );
}
