import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Form from './src/models/Form.js';
import Response from './src/models/Response.js';
import ShortUniqueId from 'short-unique-id';
import User from './src/models/User.js';

dotenv.config();

const uid = new ShortUniqueId({ length: 8 });

const forms = [
    {
        title: 'Job Application Form',
        description: 'Apply for technical positions at our company',
        fields: [
            { id: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
            { id: 'email', type: 'text', label: 'Email Address', required: true, placeholder: 'you@example.com' },
            { id: 'experience', type: 'number', label: 'Years of Experience', required: true, placeholder: '0' },
            { id: 'skills', type: 'select', label: 'Skills', required: true, options: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Express'], multiple: true },
            { id: 'preferredRole', type: 'select', label: 'Preferred Role', required: true, options: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer'] }
        ],
        shareableId: uid.rnd()
    },
    {
        title: 'Event Registration Form',
        description: 'Register for our annual tech conference',
        fields: [
            { id: 'fullName', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
            { id: 'contactNumber', type: 'text', label: 'Contact Number', required: true, placeholder: '+1234567890' },
            { id: 'ticketType', type: 'select', label: 'Ticket Type', required: true, options: ['Standard', 'VIP', 'Student'] },
            { id: 'numberOfTickets', type: 'number', label: 'Number of Tickets', required: true, placeholder: '1' },
            { id: 'attendingDays', type: 'select', label: 'Attending Days', required: true, options: ['Day 1', 'Day 2', 'Day 3', 'All Days'], multiple: true }
        ],
        shareableId: uid.rnd()
    },
    {
        title: 'Customer Feedback Form',
        description: 'Help us improve our service',
        fields: [
            { id: 'customerName', type: 'text', label: 'Customer Name', required: true, placeholder: 'Enter your name' },
            { id: 'rating', type: 'number', label: 'Rating (1-5)', required: true, placeholder: '5' },
            { id: 'serviceUsed', type: 'select', label: 'Service Used', required: true, options: ['Product A', 'Product B', 'Support', 'Consulting'] },
            { id: 'feedback', type: 'text', label: 'Feedback', required: false, placeholder: 'Share your thoughts...' },
            { id: 'wouldRecommend', type: 'select', label: 'Would you recommend us?', required: true, options: ['Yes', 'No'] }
        ],
        shareableId: uid.rnd()
    }
];

const responses = [
    // Job Application responses
    {
        formIndex: 0,
        answers: {
            name: 'John Doe',
            email: 'john@example.com',
            experience: 5,
            skills: ['React', 'Node.js', 'MongoDB'],
            preferredRole: 'Full Stack Developer'
        }
    },
    {
        formIndex: 0,
        answers: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            experience: 3,
            skills: ['React', 'TypeScript'],
            preferredRole: 'Frontend Developer'
        }
    },
    // Event Registration responses
    {
        formIndex: 1,
        answers: {
            fullName: 'Alice Johnson',
            contactNumber: '+1234567890',
            ticketType: 'VIP',
            numberOfTickets: 2,
            attendingDays: ['All Days']
        }
    },
    {
        formIndex: 1,
        answers: {
            fullName: 'Bob Williams',
            contactNumber: '+1987654321',
            ticketType: 'Standard',
            numberOfTickets: 1,
            attendingDays: ['Day 1', 'Day 2']
        }
    },
    // Customer Feedback responses
    {
        formIndex: 2,
        answers: {
            customerName: 'Carol Davis',
            rating: 5,
            serviceUsed: 'Product A',
            feedback: 'Excellent product, very satisfied!',
            wouldRecommend: 'Yes'
        }
    },
    {
        formIndex: 2,
        answers: {
            customerName: 'David Brown',
            rating: 4,
            serviceUsed: 'Support',
            feedback: 'Support team was helpful',
            wouldRecommend: 'Yes'
        }
    },
    {
        formIndex: 2,
        answers: {
            customerName: 'Emma Wilson',
            rating: 3,
            serviceUsed: 'Product B',
            feedback: 'Good but could be improved',
            wouldRecommend: 'No'
        }
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Form.deleteMany({});
        await Response.deleteMany({});
        console.log('Cleared existing data');

        const createdForms = [];
        for (const formData of forms) {
            const form = await Form.create(formData);
            createdForms.push(form);
            console.log(`Created form: ${form.title}`);
        }

        for (const resp of responses) {
            const form = createdForms[resp.formIndex];
            await Response.create({
                formId: form._id,
                answers: resp.answers
            });
            console.log(`Created response for form: ${form.title}`);
        }

        console.log('\n✅ Database seeded successfully!');
        console.log('\n🔗 Shareable Links:');
        createdForms.forEach(form => {
            console.log(`${form.title}: /form/${form.shareableId}`);
        });
        
        //superadmin
        await User.deleteMany({});
        const superAdmin = await User.create({
            username: 'superadmin',
            email: 'superadmin@example.com',
            password: 'SuperSecure123!',
            role: 'superadmin'
        });
        console.log('Created superadmin:', superAdmin.email);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();