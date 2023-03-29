require("dotenv").config();
const mongoose = require("mongoose");

async function connect() {
  // try and catch method is a convinient method to check whether the connection has been established
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); // use this syntax to connect to mongoose dtbase;     process.env.MONGO_URI (stored in .env file which is hidden from others) includes the link to the database and password required for connection
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
}

connect();

// by creating Schema, we specify what info will be stored in database
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String],
});

let Person = mongoose.model("Person", personSchema);


// below are methods to interact with database (finding, adding, removing, modifying database elements)
const createAndSavePerson = (done) => {
  let person = new Person({
    name: "George",
    age: 35,
    favoriteFoods: ["salad"],
  });
  person.save((err, data) => {
    if (err) console.log(err);
    done(null, data);
  });
};

let arrayOfPeople = [
  { name: "GeorgeII", age: 35, favoriteFoods: ["salad"] },
  { name: "GeorgeIII", age: 35, favoriteFoods: ["salad"] },
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) console.log(err);
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, (err, data) => {
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById({_id: personId}, (err, person) => {
    if (err) console.log(err)
    person.favoriteFoods.push(foodToAdd)
    person.save((err, updatedPerson) => {
      if (err) console.log(err)
      done(null, updatedPerson)
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, updatedPerson) => {
    if (err) console.log(err)
    done(null, updatedPerson)
  })

};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, updatedPerson) => {
    if (err) console.log(err)
    done (null, updatedPerson)
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, data) => {
    if (err) console.log(err)
    done(null, data)
  })

};

// If you don’t pass the callback as the last argument to Model.find() (or to the other search methods), the query is not executed. You can store the query in a variable for later use. This kind of object enables you to build up a query using chaining syntax. The actual db search is executed when you finally chain the method .exec(). You always need to pass your callback to this last method. 

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch}).sort({name: 1}).limit(2).select({age: 0}).exec((err, data) => {
    if (err) console.log(err)
    done(null, data)
  })
};


/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
