import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.

  app.get('/filteredimage/', async (req: Request, res: Response) => {
    let { image_url } = req.query;

    // validate the image_url query
    if (!image_url) {
      return res.status(400).send('image_url is required');
    }

    // call filterImageFromURL(image_url) to filter the image
    let filteredPath = await filterImageFromURL(image_url);

    // send the resulting file in the response and delete files on server on finish of the response.
    return res.status(200).sendFile(filteredPath, () => {
      deleteLocalFiles([filteredPath]);
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get('/', async (req, res) => {
    res.send('try GET /filteredimage?image_url={{}}');
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
