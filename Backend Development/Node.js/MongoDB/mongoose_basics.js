/**
 * Mongoose Basics
 * ==============
 * This file demonstrates how to use Mongoose to connect to MongoDB and perform CRUD operations.
 */

const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/fullstack_forge', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Call the connectDB function
connectDB();

// Define a Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include in query results by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
});

// Add instance methods
userSchema.methods.getFullName = function() {
  return `${this.name}`;
};

// Add static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Add query helpers
userSchema.query.active = function() {
  return this.where({ isActive: true });
};

// Add virtual properties
userSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin';
});

// Add pre-save hooks (middleware)
userSchema.pre('save', function(next) {
  console.log(`Saving user: ${this.name}`);
  // You could add password hashing here
  next();
});

// Add post-save hooks (middleware)
userSchema.post('save', function(doc, next) {
  console.log(`User saved: ${doc.name}`);
  next();
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

// Define a schema with relationships
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  tags: [String],
  comments: [
    {
      text: {
        type: String,
        required: true
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a model for posts
const Post = mongoose.model('Post', postSchema);

// CRUD Operations

// Create (Insert) a new document
const createUser = async () => {
  try {
    // Create a new user document
    const user = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    });
    
    // Save the user to the database
    const savedUser = await user.save();
    console.log('User created successfully:', savedUser);
    return savedUser;
  } catch (err) {
    console.error('Error creating user:', err.message);
    throw err;
  }
};

// Read (Find) documents
const findUsers = async () => {
  try {
    // Find all users
    const allUsers = await User.find();
    console.log('All users:', allUsers);
    
    // Find with specific conditions
    const activeUsers = await User.find({ isActive: true });
    console.log('Active users count:', activeUsers.length);
    
    // Find one specific user
    const user = await User.findOne({ email: 'john.doe@example.com' });
    console.log('Found user:', user);
    
    // Find by ID
    if (user) {
      const userById = await User.findById(user._id);
      console.log('Found user by ID:', userById);
    }
    
    // Using query helpers
    const activeUsersQuery = await User.find().active();
    console.log('Active users with query helper:', activeUsersQuery.length);
    
    // Using static methods
    const userByEmail = await User.findByEmail('john.doe@example.com');
    console.log('Found user by email (static method):', userByEmail);
    
    return allUsers;
  } catch (err) {
    console.error('Error finding users:', err.message);
    throw err;
  }
};

// Update documents
const updateUser = async (userId) => {
  try {
    // Find and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name: 'John Updated',
        'address.city': 'San Francisco',
        lastLogin: new Date()
      },
      { new: true } // Return the updated document
    );
    console.log('Updated user:', updatedUser);
    
    // Update many
    const result = await User.updateMany(
      { isActive: true },
      { $set: { role: 'user' } }
    );
    console.log(`Updated ${result.nModified} users`);
    
    return updatedUser;
  } catch (err) {
    console.error('Error updating user:', err.message);
    throw err;
  }
};

// Delete documents
const deleteUser = async (userId) => {
  try {
    // Find and delete
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log('Deleted user:', deletedUser);
    
    // Delete many
    const result = await User.deleteMany({ isActive: false });
    console.log(`Deleted ${result.deletedCount} inactive users`);
    
    return deletedUser;
  } catch (err) {
    console.error('Error deleting user:', err.message);
    throw err;
  }
};

// Advanced queries
const advancedQueries = async () => {
  try {
    // Projection - selecting specific fields
    const users = await User.find({}, 'name email role');
    console.log('Users with selected fields:', users);
    
    // Sorting
    const sortedUsers = await User.find().sort({ name: 1, createdAt: -1 });
    console.log('Sorted users:', sortedUsers.map(u => u.name));
    
    // Pagination
    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const paginatedUsers = await User.find()
      .skip(skip)
      .limit(limit);
    console.log('Paginated users:', paginatedUsers.length);
    
    // Counting
    const count = await User.countDocuments({ isActive: true });
    console.log('Active users count:', count);
    
    // Complex queries with operators
    const complexQuery = await User.find({
      createdAt: { $gte: new Date('2023-01-01') },
      $or: [
        { role: 'admin' },
        { 'address.country': 'USA' }
      ]
    });
    console.log('Complex query results:', complexQuery.length);
    
    return users;
  } catch (err) {
    console.error('Error in advanced queries:', err.message);
    throw err;
  }
};

// Populate references (joins)
const populateReferences = async () => {
  try {
    // Create a user first
    const user = await User.findOne() || await createUser();
    
    // Create a post with reference to the user
    const post = new Post({
      title: 'Introduction to Mongoose',
      content: 'This is a comprehensive guide to using Mongoose with MongoDB...',
      author: user._id,
      tags: ['mongodb', 'mongoose', 'nodejs']
    });
    
    await post.save();
    console.log('Post created:', post);
    
    // Add a comment
    post.comments.push({
      text: 'Great article!',
      author: user._id
    });
    
    await post.save();
    console.log('Comment added to post');
    
    // Find posts and populate author information
    const posts = await Post.find()
      .populate('author', 'name email')
      .populate('comments.author', 'name');
    
    console.log('Posts with populated authors:');
    posts.forEach(post => {
      console.log(`- ${post.title} by ${post.author.name}`);
      post.comments.forEach(comment => {
        console.log(`  - Comment: ${comment.text} by ${comment.author ? comment.author.name : 'Unknown'}`);
      });
    });
    
    return posts;
  } catch (err) {
    console.error('Error in populating references:', err.message);
    throw err;
  }
};

// Run all examples
const runExamples = async () => {
  try {
    console.log('\n1. Creating a user...');
    const user = await createUser();
    
    console.log('\n2. Finding users...');
    await findUsers();
    
    console.log('\n3. Updating a user...');
    await updateUser(user._id);
    
    console.log('\n4. Advanced queries...');
    await advancedQueries();
    
    console.log('\n5. Populating references...');
    await populateReferences();
    
    // Don't delete the user yet to allow other examples to run
    // console.log('\n6. Deleting a user...');
    // await deleteUser(user._id);
    
    console.log('\nAll examples completed successfully!');
  } catch (err) {
    console.error('Error running examples:', err.message);
  } finally {
    // Close the mongoose connection
    mongoose.connection.close(() => {
      console.log('Mongoose connection closed');
    });
  }
};

// Check if this script is being run directly
if (require.main === module) {
  console.log('Running Mongoose examples...');
  console.log('Note: You need MongoDB running on localhost:27017');
  console.log('Install dependencies: npm install mongoose');
  
  // Run the examples after a brief delay to ensure connection is established
  setTimeout(runExamples, 1000);
} else {
  // Export models and functions for use in other files
  module.exports = {
    User,
    Post,
    createUser,
    findUsers,
    updateUser,
    deleteUser,
    advancedQueries,
    populateReferences
  };
}