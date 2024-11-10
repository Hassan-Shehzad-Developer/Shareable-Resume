declare const html2pdf: any;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resumeForm") as HTMLFormElement;
  const generateCvButton = document.getElementById(
    "generateCv"
  ) as HTMLButtonElement;
  const resumePreview = document.getElementById(
    "resumePreview"
  ) as HTMLDivElement;
  const shareableLinkSection = document.getElementById(
    "shareableLinkSection"
  ) as HTMLDivElement;
  const shareableLink = document.getElementById(
    "shareableLink"
  ) as HTMLParagraphElement;
  const copyLinkButton = document.getElementById(
    "copyLinkButton"
  ) as HTMLButtonElement;
  const downloadPdfButton = document.getElementById(
    "downloadPdfButton"
  ) as HTMLButtonElement;
  const profilePictureInput = document.getElementById(
    "profilePicture"
  ) as HTMLInputElement;

  // Function to get URL parameters
  function getURLParameter(name: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Function to parse and display resume based on URL parameter
  function handleURLParameter() {
    const username = window.location.pathname.split("/").pop();
    if (username && username !== "index.html") {
      // Display the resume associated with this username
      (
        document.getElementById("resumePreview") as HTMLDivElement
      ).style.display = "none"; // Hide resume preview
      (document.getElementById("resumeForm") as HTMLFormElement).style.display =
        "none"; // Hide form
      (
        document.getElementById("shareableLinkSection") as HTMLDivElement
      ).style.display = "none"; // Hide shareable link section
      // You can add logic to fetch and display the resume based on the username
    }
  }

  handleURLParameter();

  // Event listener for generating the CV
  generateCvButton.addEventListener("click", () => {
    if (form.checkValidity()) {
      const formData: ResumeFormData = {
        profilePicture:
          (profilePictureInput.files && profilePictureInput.files[0]) || null,
        name: (document.getElementById("name") as HTMLInputElement).value,
        email: (document.getElementById("email") as HTMLInputElement).value,
        contactNo: (document.getElementById("contactNo") as HTMLInputElement)
          .value,
        education: (document.getElementById("education") as HTMLTextAreaElement)
          .value,
        workExperience: (
          document.getElementById("workExperience") as HTMLTextAreaElement
        ).value,
        skills: (document.getElementById("skills") as HTMLTextAreaElement)
          .value,
      };
      updateResumePreview(formData);
      generateShareableLink(
        (document.getElementById("name") as HTMLInputElement).value
      );
      form.style.display = "none"; // Hide the form
    } else {
      form.reportValidity();
    }
  });

  // Function to update the resume preview
  function updateResumePreview(formData: ResumeFormData) {
    // Create a URL for profile picture if provided
    const profilePicUrl = formData.profilePicture
      ? URL.createObjectURL(formData.profilePicture)
      : "";

    resumePreview.innerHTML = `
      <div class="resumeContent">
        ${
          profilePicUrl
            ? `<img src="${profilePicUrl}" alt="Profile Picture" class="profile-picture" />`
            : ""
        }
        <h2>${formData.name}</h2>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Contact Number:</strong> ${formData.contactNo}</p>
        <hr />
        <h3>Education</h3>
        <p>${formData.education}</p>
        <hr />
        <h3>Work Experience</h3>
        <p>${formData.workExperience}</p>
        <hr />
        <h3>Skills</h3>
        <p>${formData.skills}</p>
      </div>
    `;
    resumePreview.style.display = "block";
    shareableLinkSection.style.display = "block";
  }

  // Function to generate a shareable link
  function generateShareableLink(name: string) {
    const username = name.split(" ").join("_").toLowerCase(); // Basic username logic
    const baseUrl = window.location.origin;
    const resumeUrl = `${baseUrl}/resume/${username}`;
    shareableLink.innerHTML = `Shareable Link: <a href="${resumeUrl}" target="_blank">${resumeUrl}</a>`;
  }

  // Event listener for copying the link
  copyLinkButton.addEventListener("click", () => {
    const link = shareableLink.innerText.split(" ")[2]; // Extract link from text
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        alert("Link copied to clipboard!");
      });
    } else {
      alert("Clipboard API not supported.");
    }
  });

  // Event listener for downloading as PDF
  downloadPdfButton.addEventListener("click", () => {
    const resumeContent = document.querySelector("#resumePreview");
    if (resumeContent) {
      const opt = {
        margin: 1,
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().from(resumeContent).set(opt).save();
    }
  });
});

interface ResumeFormData {
  profilePicture: File | null;
  name: string;
  email: string;
  contactNo: string;
  education: string;
  workExperience: string;
  skills: string;
}
