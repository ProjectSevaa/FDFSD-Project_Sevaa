import request from "supertest";
import app from "../app.js";
import { Post } from "../models/post.js";

describe("Post Routes", () => {
    beforeAll(async () => {
        await Post.deleteMany({});
    });

    describe("POST /post/createPost", () => {
        it("should create a new post", async () => {
            const response = await request(app)
                .post("/post/createPost")
                .set("Cookie", ["donor_jwt=testToken"])
                .send({
                    availableFood: ["Rice", "Curry"],
                    location: "Test Location",
                    currentlocation: {
                        type: "Point",
                        coordinates: [80.123, 16.456],
                    },
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("success", true);
        });
    });
});
