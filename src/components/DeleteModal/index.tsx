import LoadingButton from "../UI/LoadingButton";
import styles from "./DeleteModal.module.scss";

type DeleteModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteModal({
  isOpen,
  isSubmitting,
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <h3>Confirmar exclusao</h3>
        <p>Tem certeza que deseja excluir esta receita?</p>
        <div className={styles.modalActions}>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
          <LoadingButton
            type="button"
            isDanger
            isLoading={isSubmitting}
            loadingText="Excluindo..."
            onClick={onConfirm}
          >
            Excluir
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
