import { LiaWindowCloseSolid } from "react-icons/lia";
const LikesModal = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white rounded-xl p-5 w-96 max-h-[80vh] overflow-y-auto relative shadow-xl">
        <h2 className="text-lg font-semibold mb-4 top-0 text-white">{title}</h2>
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
        >
          <LiaWindowCloseSolid size={20}/>
        </button>
        {children}
      </div>
    </div>
  );
};

export default LikesModal;
