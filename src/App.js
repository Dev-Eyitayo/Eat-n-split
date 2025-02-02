import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{ children }</button>
}



export default function App() {
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends)
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriendForm(false);
  }

  function handleAddFriendForm() {
    setShowAddFriendForm((show) => !showAddFriendForm)
  }

  function handleSelection(friend) {
    setSelectedFriend((currentlySelected) => currentlySelected?.id === friend.id ? null : friend);
    setShowAddFriendForm(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} onSelection={handleSelection} selectedFriend={selectedFriend} />
        {showAddFriendForm && <FormAddFriend onAddFriend = {handleAddFriend} />}
        <Button onClick={handleAddFriendForm}>{showAddFriendForm ? "Close" : "Add Friend"}</Button>
      </div>

      {selectedFriend && <FormSplitBill  selectedFriend ={selectedFriend} />}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} onSelection={onSelection} selectedFriend= {selectedFriend} />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">You owe {friend.name} ${Math.abs(friend.balance)}</p>
      )}
      {friend.balance > 0 && (
        <p className="green">{friend.name} owes you ${friend.balance}</p>
      )}
      {friend.balance === 0 && (
        <p className="black">You and {friend.name} are even</p>
      )}

      <Button onClick={() => onSelection(friend)}>{isSelected ? "Close": "Select"}</Button>      
    </li>
  );
}


function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();

  function handleSubmit(e) {
    e.preventDefault()

    if (!name || !image) return;
    const newFriend = {
      id,
      name, 
      image: `${image}?=${id}`,
      balance: 0
    }
    
    onAddFriend(newFriend)
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={ handleSubmit }>
      <label>🧑‍🤝‍🧑 Friend name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)}/>

      <label>🌄Image URL</label>
      <input type="text" value={image} onChange={e => setImage(e.target.value)} />

      <Button>Add</Button>
    </form>

  )
}


function FormSplitBill({selectedFriend}) {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill Value</label>
      <input type="text" />

      <label>🙎‍♂️ Your Expenses</label>
      <input type="text" />

      <label>🧑‍🤝‍🧑 {selectedFriend.name}'s Expenses</label>
      <input type="text" />
      
      <label>🤑 Who is Paying the bill</label>
      <select>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  )
}