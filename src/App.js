import { useState, useEffect } from "react";
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
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  // const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState(null);
  useEffect(() => {
    try {
      const storedFriends = localStorage.getItem("friends");
      if (storedFriends) {
        setFriends(JSON.parse(storedFriends));
      }
    } catch (error) {
      // Handle parsing errors here, if any
      console.error("Error loading friends from local storage:", error);
    }
  }, []);

  // Update local storage whenever the friends state changes
  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriend(newFriend) {
    // Changed parameter name here
    setFriends((prevFriends) => [...prevFriends, newFriend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    setSelectedFriends((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriends.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriends(null);
  }
  
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriends={selectedFriends}
          onSelection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriends && <FormSplitBill selectedFriends={selectedFriends}
      onSplitBill={handleSplitBill}
      />}
    </div>
  );
}
function FriendsList({ friends, onSelection, selectedFriends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friends
          friend={friend}
          key={friend.id}
          selectedFriends={selectedFriends}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}
function Friends({ friend, onSelection, selectedFriends }) {
  const isSelected = selectedFriends?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)} ₹
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)} ₹
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are Even </p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form action="" className="form-add-friend" onSubmit={handleSubmit}>
      <label> Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        id="friendName"
      />
      <label htmlFor="imageUrl">Image URL</label>
      <input
        type="text"
        onChange={(e) => setImage(e.target.value)}
        id="imageUrl"
        readOnly
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriends, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const [paidByUser, setPaidByUser] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByUser : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriends.name} </h2>
      <label>Bill Value</label>
      <input
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        type="text"
        id=""
      />
      <label>Your Expense</label>
      <input
        type="text"
        id=""
        value={paidByUser}
        onChange={(e) => setPaidByUser(Number(e.target.value))}
      />
      <label>{selectedFriends.name}'s Expense</label>
      <input type="text" id="" disabled value={bill - paidByUser} />
      <label>Who is Paying the bill</label>
      <select
        name=""
        id=""
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriends.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

