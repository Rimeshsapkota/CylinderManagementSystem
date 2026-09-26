export default function FormActions({ onCancel, isEditing }) {
    return (
      <div className="flex gap-2 justify-content-end mt-2">
        <button
          type="button"
          className="p-2 px-3 border-round cursor-pointer"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="p-2 px-3 border-round text-white border-none cursor-pointer"
          style={{ background: "#3b82f6" }}
        >
          {isEditing ? "Update" : "Save"}
        </button>
      </div>
    );
  }