import React from "react";

const Verification = () => {
  return (
    <div className="grad-bg bg-image  w-full h-full flex justify-center place-items-center text-white flex">
      <div className=" bg-grade  backdrop-blur-md p-6 md:w-6/12 lg:w-6/12 rounded">
        <div className="w-full flex-col place-items-center pb-6">
          <h2 className="text-[24px] font-bold">Sign Up</h2>
          <br />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="">
            <div className="w-full max-w-md mx-auto flex justify-between">
              <div className="w-6/12">
                <div className="w-full max-w-md mx-auto p-2">
                  <FormInput
                    label="Firs Name"
                    id="firstname"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                    icon={User}
                  />
                </div>
              </div>
              <div className="w-6/12">
                <div className="w-full max-w-md mx-auto p-2">
                  <FormInput
                    label="Last Name"
                    id="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                    icon={User}
                  />
                </div>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                label="User Name"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="User Name"
                required
                icon={User}
              />
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                icon={Mail}
              />
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                icon={Lock}
              />
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                label="Confirming Password"
                id="cpassword"
                type="password"
                value={cpassword}
                onChange={(e) => setCPassword(e.target.value)}
                placeholder="Confirmation Password"
                required
                icon={Lock}
              />
            </div>
          </div>
          <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-between place-items-center place-items-center">
            <label className="text-sm">
              I have alredy an account. <span>login</span>
            </label>
            <button type="submit">Sign Up</button>
          </div>
        </form>
        {/* <InputUI /> */}
      </div>
    </div>
  );
};

export default Verification;
