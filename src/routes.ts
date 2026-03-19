import { layout, route, index } from "@react-router/dev/routes";

export default [
  layout("layouts/PublicLayout.jsx", [
    index("pages/Landing.jsx"),
    route("login", "pages/Login.jsx"),
    route("signup", "pages/Signup.jsx"),
  ]),
  layout("layouts/OnboardingLayout.jsx", [
    route("onboarding", "pages/Onboarding.jsx"),
  ]),
  layout("layouts/ProtectedLayout.jsx", [
    route("feed", "pages/Feed.jsx"),
    route("profile/:id", "pages/Profile.jsx"),
    route("post/:id", "pages/PostDetails.jsx"),
    route("group-post/:id", "pages/GroupPostDetails.jsx"),
    route("groups", "pages/Groups.jsx"),
    route("create-group", "pages/CreateGroup.jsx"),
    route("group/:id", "pages/GroupDetails.jsx"),
    route("marketplace", "pages/marketplace/Marketplace.jsx"),
    route("create-listing", "pages/CreateListing.jsx"),
    route("listing/:id", "pages/ListingDetails.jsx"),
    route("my-orders", "pages/MyOrders.jsx"),
    route("resources", "pages/Resources.jsx"),
    route("resource/:id", "pages/ResourceDetails.jsx"),
    route("upload-resource", "pages/UploadResource.jsx"),
    route("grievances", "pages/Grievances.jsx"),
    route("file-grievance", "pages/FileGrievance.jsx"),
    route("grievance/:id", "pages/GrievanceDetails.jsx"),
    route("crisis", "pages/CrisisAlerts.jsx"),
    route("create-alert", "pages/CreateAlert.jsx"),
    route("crisis/:id", "pages/CrisisDetails.jsx"),
    route("compliance", "pages/Compliance.jsx"),
    route("messages", "pages/Messages.jsx"),
    route("messages/:userId", "pages/Messages.jsx", { id: "messages-userId" }),
    route("events", "pages/Events.jsx"),
    route("analytics", "pages/Analytics.jsx"),
    route("new-post", "pages/NewPost.jsx"),
  ]),
  layout("layouts/AdminLayout.jsx", [
    route("admin/grievances", "pages/AdminGrievances.jsx"),
    route("admin/users", "pages/AdminUsers.jsx"),
  ])
];
