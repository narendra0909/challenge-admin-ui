import { HiOutlinePencilAlt } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import "./index.css";

const ListItem = (props) => {
  const { usersDetails, onDeleteItem, onChecked, editUserItem } = props;
  const { id, name, email, role } = usersDetails;

  const onDelete = () => {
    onDeleteItem(id);
  };

  const checkBoxClicked = () => {
    onChecked(id);
  };

  const onEdit = () => {
    editUserItem(id);
  };
  return (
    <tr key={id}>
      <td>
        <input
          type="checkbox"
          className="input-checkbox"
          checked={usersDetails.select}
          onClick={checkBoxClicked}
        />
      </td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{role}</td>

      <td >
        <HiOutlinePencilAlt style={{"cursor":"pointer", "margin-left":"5px"}}  onClick={onEdit} />
        <AiOutlineDelete className="bin-icon" onClick={onDelete} />
      </td>
    </tr>
  );
};

export default ListItem;
