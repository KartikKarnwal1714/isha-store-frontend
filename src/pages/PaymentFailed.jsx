import {
  FaTimesCircle,
  FaRedo,
  FaShoppingCart,
  FaHome,
  FaHeadset,
} from "react-icons/fa";

import { Link } from "react-router-dom";


export default function PaymentFailed() {

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">


      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl p-10 text-center">


        {/* Failed Icon */}

        <div className="w-28 h-28 rounded-full bg-red-100 mx-auto flex items-center justify-center">

          <FaTimesCircle className="text-6xl text-red-600" />

        </div>



        <h1 className="text-4xl font-black mt-8 text-gray-900">

          Payment Failed

        </h1>



        <p className="text-gray-600 mt-4 text-lg">

          Unfortunately, your payment could not be completed.

          <br />

          Please try again or choose another payment method.

        </p>




        {/* Error Box */}

        <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-5">


          <p className="text-red-700 font-semibold">

            Your money is safe.

          </p>


          <p className="text-sm text-gray-600 mt-2">

            If any amount was deducted,
            it will be automatically refunded
            according to your bank's policy.

          </p>


        </div>




        {/* Buttons */}

        <div className="grid md:grid-cols-2 gap-4 mt-10">


          <Link
            to="/checkout"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition"
          >

            <FaRedo />

            Retry Payment

          </Link>




          <Link
            to="/cart"
            className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition"
          >

            <FaShoppingCart />

            Back To Cart

          </Link>


        </div>




        {/* Support */}

        <div className="mt-8 text-gray-500">


          <p className="flex justify-center items-center gap-2">

            <FaHeadset />

            Need help?

          </p>


          <p className="text-sm mt-2">

            Contact customer support for assistance.

          </p>


        </div>





        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 text-gray-500 hover:text-indigo-600"
        >

          <FaHome />

          Back To Home

        </Link>



      </div>


    </div>

  );

}