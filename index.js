import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

// Blog list array
let bloglist = [];

function generateID() {
    return Math.floor(Math.random() * 10000);
}

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/create', (req, res) => {
    res.render('createpost.ejs');
});

app.get('/viewblog', (req, res) => {
    console.log("Current bloglist:", bloglist); // Log to verify bloglist content
    res.render('blogList.ejs', { blogviews: bloglist });
});

app.post('/viewblog', (req, res) => {
    const titleName = req.body.title;
    const blogContent = req.body.content;

    const newBlog = {
        id: generateID(),
        blogTitle: titleName,
        blogDis: blogContent,
    };

    bloglist.push(newBlog);
    console.log("Blog added:", newBlog);  // Log new blog data
    console.log("Updated bloglist:", bloglist); // Log updated bloglist

    res.redirect('/viewblog');
});

app.post('/delete/:id', (req, res) => {
    const blogID = parseInt(req.params.id, 10);
    bloglist = bloglist.filter(blog => blog.id !== blogID);
    console.log(`Blog with ID ${blogID} deleted. Updated bloglist:`, bloglist); // Log after deletion
    res.redirect('/viewblog');
});

app.get('/blogDetails/:id', (req, res) => {
    const blogID = parseInt(req.params.id, 10);
    const blogdetails = bloglist.find(blog => blog.id === blogID);

    if (!blogdetails) {
        return res.send("<h1>Blog not found</h1>");
    }

    res.render('blogviewDetail.ejs', { blogdetails });
});

app.get('/edit/:id', (req, res) => {
    const blogID = parseInt(req.params.id, 10);
    const editblog = bloglist.find(blog => blog.id === blogID);

    console.log("Editing blog with ID:", blogID);
    console.log("Bloglist at edit route:", bloglist);

    if (!editblog) {
        return res.send("<h1>Blog not found</h1>");
    }

    res.render('editblog.ejs', { blog: editblog });
});

app.post('/edit/:id', (req, res) => {
    const blogID = parseInt(req.params.id, 10);
    const editblog = bloglist.find(blog => blog.id === blogID);

    if (!editblog) {
        return res.send("<h1>Blog not found</h1>");
    }

    editblog.blogTitle = req.body.blogTitle;
    editblog.blogDis = req.body.blogDis;

    console.log("Updated blog:", editblog); // Log updated blog data
    res.redirect('/viewblog');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
