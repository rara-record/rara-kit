import { AnimatePresence, motion, Variants } from 'framer-motion';
import { PropsWithChildren } from 'react';

export const Modal = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen === true && (
        <ModalContent isOpen={isOpen}>{children}</ModalContent>
      )}
    </AnimatePresence>
  );
};

const MODAL_CONTENT_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  show: { opacity: 1, scale: 1 },
};

const ModalContent = ({
  children,
  isOpen,
}: PropsWithChildren<{ isOpen: boolean }>) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.section
        variants={MODAL_CONTENT_VARIANTS}
        initial="hidden"
        exit="hidden"
        animate={isOpen ? 'show' : 'hidden'}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
      >
        {children}
      </motion.section>
    </div>
  );
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <Modal isOpen={isOpen}>
      <div className="w-full overflow-hidden flex flex-col p-4">
        {/* 헤더 */}
        <div className=" border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            x
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="px-6 py-4">{children}</div>

        {/* 푸터 */}
        <div className="">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
          >
            닫기
          </button>
          {onSubmit && (
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
