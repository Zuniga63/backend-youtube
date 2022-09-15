<link rel="stylesheet" href="editormd/css/editormd.css" />
<div id="test-editor">
    <textarea style="display:none;">### Editor.md

# Backend YouTube Top-22

**Express server RESTful API** that manages the upload of video and image content to storage web services such as Cloudinary and allows sharing said content with other users and visitors of the  platform.

It uses **authentication via JSON web Token (JWT)** with password encryption using **Bcrypt**, mailing with **nodemailer** and communication with a non-relational database **(MongoDB)** using the a **ODM (Mongoose)**.

**Table of Contents**

[TOCM]

[========]

# Dependencies

![Express](https://user-images.githubusercontent.com/50376585/190275778-8c1f44dc-aad3-4776-b8df-30fbd218de8f.png)![Mongoose](https://user-images.githubusercontent.com/50376585/190275791-576a74f6-4251-4479-9a28-2393b2309eb1.png)![JWT](https://user-images.githubusercontent.com/50376585/190276105-48680784-aff8-47e3-af91-b82dfe9a33fd.png)![bcrypt](https://user-images.githubusercontent.com/50376585/190279827-5fb8525d-b45a-4bb3-81b5-4e5755413c5a.jpeg)![busboy](https://user-images.githubusercontent.com/50376585/190279838-2757a98b-caa9-4026-9494-ef47174411b6.png)![cloudinary](https://user-images.githubusercontent.com/50376585/190279842-ab1352f7-25a5-49d8-9e86-eaec857c3fb8.png)![cors](https://user-images.githubusercontent.com/50376585/190279844-b31e6be6-77de-4cc5-b2e2-38d99bfc765a.jpg)![dotenv](https://user-images.githubusercontent.com/50376585/190279846-d3c63d4d-8330-4190-bf3d-f52309994626.png)![Morgan-npm](https://user-images.githubusercontent.com/50376585/190280006-97572dfa-a325-432f-b84b-6a21cecf503e.png)

# Dev Dependencies

This project use the next dependencies for dev

| Dependencie  | Description  |
| ------------ | ------------ |
|  Eslint | Use Eslint with AirBnB rules   |
| Prettier | For format the style code  |
|  Husky & lint-staged | For control the pre-commit  |
|  nodemon | For the server to listen for changes and update itself  |

[========]

# Installation

1. Clone this repository `git clone https://github.com/Zuniga63/backend-youtube.git`
2. Install the dependencies with node `npm install`
3. Create the .env file with `cp .env.example .env`
4. Write the credentials to the file **.env**
5. After adding Cloudinary credentials run the script for create the presets `npm run cloudpresets`
6. Finished for dev run `npm run dev` and for production `npm run start`

# Documentation

swagger-ui-express is used for the documentation of the endpoints and these can be found in the path “/api-docs”

![api-docs](https://user-images.githubusercontent.com/50376585/190294648-64779f4f-40a3-4c72-9ef5-d50487a9e7cb.gif)

    </textarea>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="editormd/editormd.min.js"></script>
<script type="text/javascript">
    $(function() {
        var editor = editormd("test-editor", {
            // width  : "100%",
            // height : "100%",
            path   : "editormd/lib/"
        });
    });
</script>
