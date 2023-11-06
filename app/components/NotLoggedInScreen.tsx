// we will also render NavBar. NavBar should have a signin page.

import NavBar from "./NavBar";

function NotLoggedInScreen() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex grow flex-col gap-2 items-center justify-center">
        <h1 className="font-semibold text-lg">You are not logged in</h1>
        <p className="text-neutral-500">Please login to access the Library</p>
      </div>
    </div>
  );
}

export default NotLoggedInScreen;
