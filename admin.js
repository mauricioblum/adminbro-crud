const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  completed: Boolean,
  created_at: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', ProjectSchema);

const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  resources: [
    {
      resource: Project,
      options: {
        properties: {
          description: {
            type: 'richtext',
          },
          created_at: {
            isVisible: { edit: false, list: true, show: true, filter: true },
          },
        },
      },
    },
  ],
  locale: {
    translations: {
      labels: {
        Project: 'Meus Projetos',
      },
    },
  },
  rootPath: '/admin',
});

const router = AdminBroExpress.buildRouter(adminBro);

const express = require('express');
const server = express();

server.use(adminBro.options.rootPath, router);

const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/adminbro', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await server.listen(5500, () => console.log('Server started'));
};

run();
