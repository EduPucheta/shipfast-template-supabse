(function () {
    if (window.FeedbackWidget) return;
  
    window.FeedbackWidget = {
      init: function ({ projectId }) {
        if (!projectId) {
          console.error("FeedbackWidget: Missing projectId");
          return;
        }
  
        this.projectId = projectId;
        document.addEventListener("DOMContentLoaded", this.createButton.bind(this));
      },
  
      createButton: function () {
        if (!document.body) return;
  
        const button = document.createElement("button");
        button.innerText = "Give Feedback";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.padding = "10px 15px";
        button.style.background = "#007bff";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.onclick = this.openModal.bind(this);
        document.body.appendChild(button);
      },
  
      openModal: function () {
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.background = "rgba(0,0,0,0.5)";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.innerHTML = `
          <div style="background: white; padding: 20px; border-radius: 8px; min-width: 300px;">
            <h3>Submit Feedback!</h3>
            <textarea id="feedbackText" style="width:100%; height:100px;"></textarea>
            <button id="submitFeedback">Send</button>
            <button id="closeModal">Close</button>
          </div>
        `;
  
        document.body.appendChild(modal);
  
        document.getElementById("submitFeedback").onclick = () => {
          const feedback = document.getElementById("feedbackText").value;
          fetch("https://yourdomain.com/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId: this.projectId, feedback }),
          }).then(() => {
            alert("Feedback sent!");
            document.body.removeChild(modal);
          });
        };
  
        document.getElementById("closeModal").onclick = () => document.body.removeChild(modal);
      },
    };
  })();
  