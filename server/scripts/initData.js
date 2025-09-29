const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/home-tuition', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const initData = async () => {
  try {
    console.log('Initializing database with sample data...');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Subject.deleteMany({});

    // Create sample subjects
    const subjects = [
      // Class 1-5 subjects
      { name: 'English', class: '1', board: 'CBSE', pricing: { monthly: 2000, hourly: 200 } },
      { name: 'Mathematics', class: '1', board: 'CBSE', pricing: { monthly: 2500, hourly: 250 } },
      { name: 'Environmental Studies', class: '1', board: 'CBSE', pricing: { monthly: 1500, hourly: 150 } },
      { name: 'Hindi', class: '1', board: 'CBSE', pricing: { monthly: 1500, hourly: 150 } },
      
      // Class 6-8 subjects
      { name: 'English', class: '6', board: 'CBSE', pricing: { monthly: 2500, hourly: 250 } },
      { name: 'Mathematics', class: '6', board: 'CBSE', pricing: { monthly: 3000, hourly: 300 } },
      { name: 'Science', class: '6', board: 'CBSE', pricing: { monthly: 3000, hourly: 300 } },
      { name: 'Social Studies', class: '6', board: 'CBSE', pricing: { monthly: 2000, hourly: 200 } },
      { name: 'Hindi', class: '6', board: 'CBSE', pricing: { monthly: 2000, hourly: 200 } },
      
      // Class 9-10 subjects
      { name: 'English', class: '9', board: 'CBSE', pricing: { monthly: 3000, hourly: 300 } },
      { name: 'Mathematics', class: '9', board: 'CBSE', pricing: { monthly: 3500, hourly: 350 } },
      { name: 'Physics', class: '9', board: 'CBSE', pricing: { monthly: 3500, hourly: 350 } },
      { name: 'Chemistry', class: '9', board: 'CBSE', pricing: { monthly: 3500, hourly: 350 } },
      { name: 'Biology', class: '9', board: 'CBSE', pricing: { monthly: 3500, hourly: 350 } },
      { name: 'Social Studies', class: '9', board: 'CBSE', pricing: { monthly: 2500, hourly: 250 } },
      { name: 'Hindi', class: '9', board: 'CBSE', pricing: { monthly: 2500, hourly: 250 } },
      
      // Class 11-12 subjects
      { name: 'English', class: '11', board: 'CBSE', pricing: { monthly: 4000, hourly: 400 } },
      { name: 'Mathematics', class: '11', board: 'CBSE', pricing: { monthly: 4500, hourly: 450 } },
      { name: 'Physics', class: '11', board: 'CBSE', pricing: { monthly: 4500, hourly: 450 } },
      { name: 'Chemistry', class: '11', board: 'CBSE', pricing: { monthly: 4500, hourly: 450 } },
      { name: 'Biology', class: '11', board: 'CBSE', pricing: { monthly: 4500, hourly: 450 } },
      { name: 'Accountancy', class: '11', board: 'CBSE', pricing: { monthly: 4000, hourly: 400 } },
      { name: 'Business Studies', class: '11', board: 'CBSE', pricing: { monthly: 4000, hourly: 400 } },
      { name: 'Economics', class: '11', board: 'CBSE', pricing: { monthly: 4000, hourly: 400 } },
      { name: 'Computer Science', class: '11', board: 'CBSE', pricing: { monthly: 4000, hourly: 400 } },
      { name: 'Hindi', class: '11', board: 'CBSE', pricing: { monthly: 3000, hourly: 300 } },
    ];

    await Subject.insertMany(subjects);
    console.log('✅ Subjects created');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@hometuition.com',
      password: hashedPassword,
      phone: '+919876543210',
      role: 'admin',
      address: {
        street: 'Admin Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    });
    await adminUser.save();
    console.log('✅ Admin user created');

    // Create sample students
    const students = [
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '+919876543211',
        class: '10',
        subjects: ['Mathematics', 'Physics', 'Chemistry']
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        phone: '+919876543212',
        class: '12',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology']
      },
      {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        phone: '+919876543213',
        class: '8',
        subjects: ['Mathematics', 'Science', 'English']
      }
    ];

    for (const studentData of students) {
      const user = new User({
        name: studentData.name,
        email: studentData.email,
        password: hashedPassword,
        phone: studentData.phone,
        role: 'student',
        address: {
          street: 'Student Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        }
      });
      await user.save();

      const student = new Student({
        userId: user._id,
        class: studentData.class,
        subjects: studentData.subjects.map(subject => ({
          subject,
          isActive: true
        })),
        testMarks: [
          {
            subject: studentData.subjects[0],
            testName: 'Monthly Test 1',
            marks: 85,
            totalMarks: 100,
            date: new Date(),
            remarks: 'Good performance'
          }
        ],
        feeStructure: {
          monthlyFee: studentData.subjects.length * 3000,
          subjects: studentData.subjects.map(subject => ({
            subject,
            fee: 3000
          })),
          totalMonthlyFee: studentData.subjects.length * 3000
        },
        pendingFees: [
          {
            month: 'March',
            year: 2024,
            amount: studentData.subjects.length * 3000,
            dueDate: new Date('2024-03-31'),
            isPaid: false
          }
        ]
      });
      await student.save();
    }
    console.log('✅ Sample students created');

    // Create sample teachers
    const teachers = [
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+919876543214',
        subjects: ['Mathematics', 'Physics'],
        classes: ['9', '10', '11', '12'],
        experience: 15,
        location: {
          pincode: '400001',
          area: 'Andheri',
          city: 'Mumbai',
          state: 'Maharashtra',
          travelRadius: 10
        }
      },
      {
        name: 'Ms. Sunita Singh',
        email: 'sunita@example.com',
        phone: '+919876543215',
        subjects: ['Chemistry', 'Biology'],
        classes: ['9', '10', '11', '12'],
        experience: 12,
        location: {
          pincode: '400002',
          area: 'Bandra',
          city: 'Mumbai',
          state: 'Maharashtra',
          travelRadius: 15
        }
      },
      {
        name: 'Prof. Amit Verma',
        email: 'amit.verma@example.com',
        phone: '+919876543216',
        subjects: ['English', 'Social Studies'],
        classes: ['6', '7', '8', '9', '10'],
        experience: 10,
        location: {
          pincode: '400003',
          area: 'Powai',
          city: 'Mumbai',
          state: 'Maharashtra',
          travelRadius: 20
        }
      }
    ];

    for (const teacherData of teachers) {
      const user = new User({
        name: teacherData.name,
        email: teacherData.email,
        password: hashedPassword,
        phone: teacherData.phone,
        role: 'teacher',
        address: {
          street: 'Teacher Street',
          city: teacherData.location.city,
          state: teacherData.location.state,
          pincode: teacherData.location.pincode,
          country: 'India'
        }
      });
      await user.save();

      const teacher = new Teacher({
        userId: user._id,
        qualification: {
          degree: 'M.Sc',
          university: 'Mumbai University',
          yearOfPassing: 2010
        },
        experience: {
          years: teacherData.experience,
          specializations: teacherData.subjects
        },
        subjects: teacherData.subjects.map(subject => ({
          subject,
          classes: teacherData.classes,
          hourlyRate: 300,
          isAvailable: true
        })),
        location: teacherData.location,
        rating: {
          average: 4.5,
          count: 25
        },
        bio: `Experienced teacher with ${teacherData.experience} years of teaching experience in ${teacherData.subjects.join(', ')}.`,
        isVerified: true
      });
      await teacher.save();
    }
    console.log('✅ Sample teachers created');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\nSample accounts created:');
    console.log('Admin: admin@hometuition.com / password123');
    console.log('Students: rahul@example.com, priya@example.com, amit@example.com / password123');
    console.log('Teachers: rajesh@example.com, sunita@example.com, amit.verma@example.com / password123');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    mongoose.connection.close();
  }
};

initData();

