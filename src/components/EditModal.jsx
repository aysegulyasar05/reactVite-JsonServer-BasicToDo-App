

const EditModal = ({
  handleEditConfirm,
  setShowModal,
  setEditingItem,
  editingItem,
}) => {
  return (
    <div className="modal-wrapper">
      <div className="modal-inner">
        <h5>Edit your todo</h5>
        <input
          type="text"
          onChange={(e) =>
            setEditingItem({
              ...editingItem,
              title: e.target.value,
              date: new Date(),
            })
          }
          className="form-control shadow"
          value={editingItem.title}
        />
        <div className="d-flex justify-content-center gap-5 mt-4">
          <button
            className="btn btn-warning"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button className="btn btn-info" onClick={handleEditConfirm}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal
