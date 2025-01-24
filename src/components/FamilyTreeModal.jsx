import PropTypes from "prop-types";

const FamilyTreeModal = ({ familyData, onClose }) => {
  if (!familyData) return null;

  const {
    name,
    name_in_nepali,
    pusta_number,
    contact_details,
    family_relations,
    date_of_birth,
    status,
    profession,
    gender,
    photo_url,
  } = familyData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
        >
          &#x2715;
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <img
            src={photo_url}
            alt={name}
            className="w-16 h-16 rounded-full border-2 border-gray-300"
          />
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm text-gray-500">{name_in_nepali}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4 text-sm md:text-base">
          <p>
            <strong>Pusta Number:</strong> {pusta_number}
          </p>
          <p>
            <strong>Profession:</strong> {profession}
          </p>
          <p>
            <strong>Gender:</strong> {gender}
          </p>
          <p>
            <strong>Date of Birth:</strong> {date_of_birth}
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
            <p>
              <strong>Email:</strong> {contact_details.email}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {contact_details.phone_numbers.join(", ")}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {`${contact_details.current_address.street}, ${contact_details.current_address.city}, ${contact_details.current_address.country}`}
            </p>
            {contact_details.social_links.length > 0 && (
              <p>
                <strong>Social Links:</strong>{" "}
                <a
                  href={contact_details.social_links[0]}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </p>
            )}
          </div>

          {/* Family Relations */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Family Relations</h3>
            <p>
              <strong>Father:</strong> {family_relations.father}
            </p>
            <p>
              <strong>Mother:</strong> {family_relations.mother}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

FamilyTreeModal.propTypes = {
  familyData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    name_in_nepali: PropTypes.string,
    pusta_number: PropTypes.string,
    contact_details: PropTypes.shape({
      email: PropTypes.string,
      phone_numbers: PropTypes.arrayOf(PropTypes.string),
      current_address: PropTypes.shape({
        street: PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
      }),
      social_links: PropTypes.arrayOf(PropTypes.string),
    }),
    family_relations: PropTypes.shape({
      father: PropTypes.string,
      mother: PropTypes.string,
    }),
    date_of_birth: PropTypes.string,
    status: PropTypes.string,
    profession: PropTypes.string,
    gender: PropTypes.string,
    photo_url: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FamilyTreeModal;




// import PropTypes from 'prop-types';


// const FamilyTreeModal = ({ familyData, onClose }) => {
//     if (!familyData) return null;

//     const { name, name_in_nepali, pusta_number, contact_details, family_relations, date_of_birth, status, profession, gender, photo_url } = familyData;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white w-11/12 max-w-3xl p-6 left-20 rounded-lg relative">
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
//                 >
//                     &#x2715;
//                 </button>

//                 {/* Header */}
//                 <div className="flex items-center gap-4 mb-6">
//                     <img
//                         src={photo_url}
//                         alt={name}
//                         className="w-16 h-16 rounded-full border-2 border-gray-300"
//                     />
//                     <div>
//                         <h2 className="text-xl font-bold">{name}</h2>
//                         <p className="text-sm text-gray-500">{name_in_nepali}</p>
//                     </div>
//                 </div>

//                 {/* Details Section */}
//                 <div className="space-y-4">
//                     <p>
//                         <strong>Pusta Number:</strong> {pusta_number}
//                     </p>
//                     <p>
//                         <strong>Profession:</strong> {profession}
//                     </p>
//                     <p>
//                         <strong>Gender:</strong> {gender}
//                     </p>
//                     <p>
//                         <strong>Date of Birth:</strong> {date_of_birth}
//                     </p>
//                     <p>
//                         <strong>Status:</strong> {status}
//                     </p>

//                     {/* Contact Details */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
//                         <p>
//                             <strong>Email:</strong> {contact_details.email}
//                         </p>
//                         <p>
//                             <strong>Phone:</strong>{" "}
//                             {contact_details.phone_numbers.join(", ")}
//                         </p>
//                         <p>
//                             <strong>Address:</strong> {`${contact_details.current_address.street}, ${contact_details.current_address.city}, ${contact_details.current_address.country}`}
//                         </p>
//                         {contact_details.social_links.length > 0 && (
//                             <p>
//                                 <strong>Social Links:</strong>{" "}
//                                 <a
//                                     href={contact_details.social_links[0]}
//                                     className="text-blue-500 underline"
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                 >
//                                     Facebook
//                                 </a>
//                             </p>
//                         )}
//                     </div>

//                     {/* Family Relations */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-2">Family Relations</h3>
//                         <p>
//                             <strong>Father:</strong> {family_relations.father}
//                         </p>
//                         <p>
//                             <strong>Mother:</strong> {family_relations.mother}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// FamilyTreeModal.propTypes = {
//     familyData: PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         name_in_nepali: PropTypes.string,
//         pusta_number: PropTypes.string,
//         contact_details: PropTypes.shape({
//             email: PropTypes.string,
//             phone_numbers: PropTypes.arrayOf(PropTypes.string),
//             current_address: PropTypes.shape({
//                 street: PropTypes.string,
//                 city: PropTypes.string,
//                 country: PropTypes.string,
//             }),
//             social_links: PropTypes.arrayOf(PropTypes.string),
//         }),
//         family_relations: PropTypes.shape({
//             father: PropTypes.string,
//             mother: PropTypes.string,
//         }),
//         date_of_birth: PropTypes.string,
//         status: PropTypes.string,
//         profession: PropTypes.string,
//         gender: PropTypes.string,
//         photo_url: PropTypes.string,
//     }).isRequired,
//     onClose: PropTypes.func.isRequired,
// };

// export default FamilyTreeModal;


///// Second Working 
// import PropTypes from "prop-types";
// import sample1 from '/src/assets/public/sample_2.jpg';
// import sample2 from '/src/assets/public/sample_3.jpg';

// const FamilyTreeModal = ({ familyData, onClose }) => {
//   if (!familyData) return null;

//   const { name, photo_url, family_relations } = familyData;

//   // Default placeholder image
//   const placeholderImage1 = sample1;
//   const placeholderImage2 = sample2;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white w-11/12 max-w-4xl p-6 rounded-lg relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
//         >
//           &#x2715;
//         </button>

//         {/* Main Individual */}
//         <div className="flex justify-center mb-6">
//           <div className="flex flex-col items-center">
//             <img
//               src={photo_url || placeholderImage1}
//               alt={name}
//               className="w-24 h-24 rounded-full border-2 border-gray-300"
//             />
//             <p className="text-center font-semibold">{name}</p>
//           </div>
//         </div>

//         {/* Family Relations */}
//         <div className="flex justify-around">
//           {/* Father */}
//           {family_relations.father && (
//             <div className="flex flex-col items-center">
//               <p className="font-semibold">Father</p>
//               <div>
//                 <img
//                   src={placeholderImage1}
//                   alt={family_relations.father}
//                   className="w-16 h-16 rounded-full border-2 border-gray-300"
//                 />
//                 <p className="text-center text-sm">{family_relations.father}</p>
//               </div>
//             </div>
//           )}

//           {/* Mother */}
//           {family_relations.mother && (
//             <div className="flex flex-col items-center">
//               <p className="font-semibold">Mother</p>
//               <div>
//                 <img
//                   src={placeholderImage2}
//                   alt={family_relations.mother}
//                   className="w-16 h-16 rounded-full border-2 border-gray-300"
//                 />
//                 <p className="text-center text-sm">{family_relations.mother}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// FamilyTreeModal.propTypes = {
//   familyData: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     name_in_nepali: PropTypes.string,
//     pusta_number: PropTypes.string,
//     contact_details: PropTypes.shape({
//       email: PropTypes.string,
//       phone_numbers: PropTypes.arrayOf(PropTypes.string),
//       current_address: PropTypes.shape({
//         street: PropTypes.string,
//         city: PropTypes.string,
//         country: PropTypes.string,
//       }),
//       social_links: PropTypes.arrayOf(PropTypes.string),
//     }),
//     family_relations: PropTypes.shape({
//       father: PropTypes.string,
//       mother: PropTypes.string,
//       siblings: PropTypes.arrayOf(
//         PropTypes.shape({
//           name: PropTypes.string.isRequired,
//           photo_url: PropTypes.string,
//         })
//       ),
//       children: PropTypes.arrayOf(
//         PropTypes.shape({
//           name: PropTypes.string.isRequired,
//           photo_url: PropTypes.string,
//         })
//       ),
//     }),
//     date_of_birth: PropTypes.string,
//     status: PropTypes.string,
//     profession: PropTypes.string,
//     gender: PropTypes.string,
//     photo_url: PropTypes.string,
//   }).isRequired,
//   onClose: PropTypes.func.isRequired,
// };

// export default FamilyTreeModal;


//THird Working Example
// import PropTypes from "prop-types";
// import sample1 from '/src/assets/public/sample_2.jpg';

// const FamilyTreeModal = ({ familyData, onClose }) => {
//   if (!familyData) return null;

//   const { name, photo_url, family_relations } = familyData;

//   // Default placeholder image
//   const placeholderImage = sample1;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white w-11/12 max-w-4xl p-6 rounded-lg relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
//         >
//           &#x2715;
//         </button>

//         {/* Main Individual */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="flex flex-col items-center">
//             <img
//               src={photo_url || placeholderImage}
//               alt={name}
//               className="w-24 h-24 rounded-full border-2 border-gray-300"
//             />
//             <p className="text-center font-semibold">{name}</p>
//           </div>
//         </div>

//         {/* Family Relations */}
//         <div className="flex justify-center items-center relative">
//           {/* Horizontal Line */}

//           {/* Father */}
//           {family_relations.father && (
//             <div className="flex flex-col items-center mx-6">
//               <div className="h-10 w-0.5 bg-blue-500"></div>
//               <img
//                 src={placeholderImage}
//                 alt={family_relations.father}
//                 className="w-16 h-16 rounded-full border-2 border-gray-300"
//               />
//               <p className="text-center text-sm mt-2">
//                 {family_relations.father}
//               </p>
//             </div>
//           )}

//           {/* Mother */}
//           {family_relations.mother && (
//             <div className="flex flex-col items-center mx-6">
//               <div className="h-10 w-0.5 bg-blue-500"></div>
//               <img
//                 src={placeholderImage}
//                 alt={family_relations.mother}
//                 className="w-16 h-16 rounded-full border-2 border-gray-300"
//               />
//               <p className="text-center text-sm mt-2">
//                 {family_relations.mother}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Children */}
//         {family_relations.children && (
//           <div className="flex justify-center mt-10 relative">
//             {/* Horizontal Line */}
//             {/* <div className="absolute top-0 w-full h-0.5 bg-blue-500"></div> */}
//             {family_relations.children.map((child, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col items-center mx-6 relative"
//               >
//                 {/* <div className="h-10 w-0.5 bg-blue-500 absolute top-0"></div> */}
//                 <img
//                   src={child.photo_url || placeholderImage}
//                   alt={child.name}
//                   className="w-16 h-16 rounded-full border-2 border-gray-300"
//                 />
//                 <p className="text-center text-sm mt-2">{child.name}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// FamilyTreeModal.propTypes = {
//   familyData: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     name_in_nepali: PropTypes.string,
//     pusta_number: PropTypes.string,
//     contact_details: PropTypes.shape({
//       email: PropTypes.string,
//       phone_numbers: PropTypes.arrayOf(PropTypes.string),
//       current_address: PropTypes.shape({
//         street: PropTypes.string,
//         city: PropTypes.string,
//         country: PropTypes.string,
//       }),
//       social_links: PropTypes.arrayOf(PropTypes.string),
//     }),
//     family_relations: PropTypes.shape({
//       father: PropTypes.string,
//       mother: PropTypes.string,
//       siblings: PropTypes.arrayOf(
//         PropTypes.shape({
//           name: PropTypes.string.isRequired,
//           photo_url: PropTypes.string,
//         })
//       ),
//       children: PropTypes.arrayOf(
//         PropTypes.shape({
//           name: PropTypes.string.isRequired,
//           photo_url: PropTypes.string,
//         })
//       ),
//     }),
//     date_of_birth: PropTypes.string,
//     status: PropTypes.string,
//     profession: PropTypes.string,
//     gender: PropTypes.string,
//     photo_url: PropTypes.string,
//   }).isRequired,
//   onClose: PropTypes.func.isRequired,
// };

// export default FamilyTreeModal;


// import PropTypes from "prop-types";
// import { Tree, TreeNode } from "react-organizational-chart";

// const placeholderImage = "https://via.placeholder.com/150"; // Placeholder image

// const FamilyTreeModal = ({ familyData, onClose }) => {
//     if (!familyData) return null;

//     const { name, photo_url, family_relations = {} } = familyData;

//     // Render a single node
//     const renderNode = (personName, photoUrl = placeholderImage) => (
//         <div className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md w-[120px] h-[100px]">
//             <img
//                 src={photoUrl}
//                 alt={personName}
//                 className="w-12 h-12 rounded-full mb-2"
//             />
//             <p className="text-xs text-center">{personName}</p>
//         </div>
//     );


//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white h-4/5 w-11/12 max-w-4xl p-6 rounded-lg relative">
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
//                 >
//                     &#x2715;
//                 </button>

//                 <h2 className="text-center text-xl font-bold mb-4">
//                     Family Tree of {name}
//                 </h2>



//                 {/* Family Tree */}
//                 <div className="flex justify-center items-center bg-red-500">
//                     <Tree className="w-full inline-block"
//                         lineWidth={"2px"}
//                         lineColor={"blue"}
//                         lineBorderRadius={"10px"}
//                         label={renderNode(name, photo_url)}
//                     >
//                         {/* Parents */}
//                         <TreeNode label={renderNode(family_relations?.father || "Father")} />
//                         <TreeNode label={renderNode(family_relations?.mother || "Mother")}>
//                             {/* Children */}
//                             {family_relations?.children?.map((child, index) => (
//                                 <TreeNode
//                                     key={index}
//                                     label={renderNode(
//                                         child.name,
//                                         child.photo_url || placeholderImage
//                                     )}
//                                 />
//                             ))}
//                         </TreeNode>
//                     </Tree>
//                 </div>
//             </div>
//         </div>
//     );
// };

// FamilyTreeModal.propTypes = {
//     familyData: PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         photo_url: PropTypes.string,
//         family_relations: PropTypes.shape({
//             father: PropTypes.string,
//             mother: PropTypes.string,
//             children: PropTypes.arrayOf(
//                 PropTypes.shape({
//                     name: PropTypes.string.isRequired,
//                     photo_url: PropTypes.string,
//                 })
//             ),
//         }),
//     }).isRequired,
//     onClose: PropTypes.func.isRequired,
// };

// export default FamilyTreeModal;






// import PropTypes from "prop-types";
// import { Tree, TreeNode } from "react-organizational-chart";

// import sample1 from '/src/assets/public/sample_2.jpg';

// const FamilyTreeModal = ({ familyData, onClose }) => {
//   if (!familyData) return null;

//   const { name, photo_url, family_relations = {} } = familyData;

//   // Render a single circular node
//   const renderNode = (personName, photoUrl = sample1) => (
//     <div className="flex flex-col items-center justify-center rounded-full  w-28 h-28">
//       <img
//         src={photoUrl}
//         alt={personName}
//         className="w-full h-full rounded-full"
//       />
//       <p className="text-xs text-center">{personName}</p>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white w-11/12 max-w-4xl p-6 rounded-lg relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
//         >
//           &#x2715;
//         </button>

//         <h2 className="text-center text-xl font-bold mb-4">
//           Family Tree of {name}
//         </h2>

//         {/* Family Tree */}
//         <div className="flex justify-center">
//           <Tree
//             lineWidth={"2px"}
//             lineColor={"blue"}
//             lineBorderRadius={"10px"}
//             label={renderNode(name, photo_url)}
//           >
//             {/* Parents */}
//             <TreeNode label={renderNode(family_relations?.father || "Father")} />
//             <TreeNode label={renderNode(family_relations?.mother || "Mother")}>
//               {/* Children */}
//               {family_relations?.children?.map((child, index) => (
//                 <TreeNode
//                   key={index}
//                   label={renderNode(
//                     child.name,
//                     child.photo_url || sample1
//                   )}
//                 />
//               ))}
//             </TreeNode>
//           </Tree>
//         </div>
//       </div>
//     </div>
//   );
// };

// FamilyTreeModal.propTypes = {
//   familyData: PropTypes.shape({
//     name: PropTypes.string.isRequired,
//     photo_url: PropTypes.string,
//     family_relations: PropTypes.shape({
//       father: PropTypes.string,
//       mother: PropTypes.string,
//       children: PropTypes.arrayOf(
//         PropTypes.shape({
//           name: PropTypes.string.isRequired,
//           photo_url: PropTypes.string,
//         })
//       ),
//     }),
//   }).isRequired,
//   onClose: PropTypes.func.isRequired,
// };

// export default FamilyTreeModal;




// Latest Working Example


// import PropTypes from "prop-types";
// import { Tree, TreeNode } from "react-organizational-chart";

// import sample1 from "/src/assets/public/sample_2.jpg";

// const FamilyTreeModal = ({ familyData, onClose }) => {
//     if (!familyData) return null;

//     const { name, photo_url } = familyData;

//     // Function to render circular nodes
//     const renderNode = (personName, photoUrl = sample1) => (
//         <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full ">
//             <img
//                 src={photoUrl}
//                 alt={personName}
//                 className="w-full h-full rounded-full "
//             />
//             <p className="text-xs text-center">{personName}</p>
//         </div>
//     );

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white w-11/12 max-w-4xl p-6 rounded-lg relative">
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
//                 >
//                     &#x2715;
//                 </button>

//                 <h2 className="text-center text-xl font-bold mb-4">
//                     Family Tree of {name}
//                 </h2>

//                 {/* Family Tree */}
//                 <div className="flex justify-center">
//                     <Tree
//                         lineWidth={"2px"}
//                         lineColor={"black"}
//                         lineBorderRadius={"10px"}
//                     //renderNode(name, photo_url)
//                     >

//                         {/* <TreeNode label={renderNode(name, photo_url)} /> */}
//                         <TreeNode label={renderNode("parent", photo_url)} />
//                         <TreeNode label={renderNode("parent", photo_url)}>
//                             {/* <TreeNode label={`base ${name}`} /> */}
//                             <TreeNode label={<img className="ml-[80px] w-20 h-20 rounded-full" src={photo_url} />}>
//                                 {/* <TreeNode label={renderNode(name, photo_url)}> */}
//                                 <TreeNode >
//                                     <TreeNode label={renderNode("Below Node 0")} />
//                                     <TreeNode label={renderNode("Below Node 0")} />
//                                 </TreeNode>
//                             </TreeNode>


//                         </TreeNode>




//                     </Tree>
//                 </div>
//             </div>
//         </div>
//     );
// };

// FamilyTreeModal.propTypes = {
//     familyData: PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         photo_url: PropTypes.string,
//     }).isRequired,
//     onClose: PropTypes.func.isRequired,
// };

// export default FamilyTreeModal;
