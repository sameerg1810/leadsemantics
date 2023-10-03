TextBi.prototype.corpusModal = function () {
  var url = "/corpusDetails";
  document.getElementById("loader").style.display = "block";
  let message = [{ message: "Loading...", timing: 0, color: "black" }];
  startLoader(message);

  sendJQueryAjaxAsyncReq(url).then(async (resp) => {
    if (resp.redirected) {
      window.location.assign(resp.url);
      return;
    } else {
      var data_result = JSON.parse(resp);
      console.log("line number 571....", data_result);
      if (data_result.status == "error") {
        document.getElementById("icorpus_modal").style.display = "block";
        document.getElementById("blurContainer").style.display = "block";
        showMessage("NO Corpus Found", "");
      } else {
        var data = JSON.parse(data_result.data);
        document.getElementById("icorpus_modal").style.display = "block";
        document.getElementById("loader").style.display = "none";
        document.getElementById("blurContainer").style.display = "block";
        var table1 = document.getElementById("corpus_table");
        var tbody = table1.querySelector("tbody");
        if (tbody) {
          tbody.innerHTML = "";
        } else {
          tbody = document.createElement("tbody");
        }
        data.forEach(function (rowData) {
          var row = document.createElement("tr");
          Object.entries(rowData).forEach(function ([key, value]) {
            document.getElementById("total_file_count").innerHTML =
              rowData.Previous_Count;
            if (
              key !== "create_corpus_date" &&
              key !== "corpus_id" &&
              key !== "index_type" &&
              key !== "db_name" &&
              key !== "index_name" &&
              key !== "corpus_name" &&
              key !== "Previous_Count"
            ) {
              var cell = document.createElement("td");
              var processDocCountValue = rowData.process_doc_count
                .split("/")[1]
                .trim();
              if (key === "batch_under_process") {
                if (value === "yes") {
                  cell.textContent = "In Progress";
                  cell.style.color = "blue";
                  cell.classList.add("progress_style");
                } else if (
                  value === "no" &&
                  rowData.corpus_file_count == 0 &&
                  processDocCountValue == "0"
                ) {
                  cell.textContent = "---";
                  cell.classList.add("process_dash");
                } else if (
                  (rowData.corpus_file_count !== 0 &&
                    processDocCountValue !== "0") ||
                  (rowData.corpus_file_count !== 0 &&
                    processDocCountValue == "0")
                ) {
                  var batchProcessButton = document.createElement("button");
                  var buttonId = "batchProcessButton_" + rowData.corpus_id;
                  batchProcessButton.id = buttonId;
                  batchProcessButton.classList.add("batchButton");
                  batchProcessButton.textContent = "Start";
                  batchProcessButton.addEventListener(
                    "click",
                    function (event) {
                      //added the event.stopPropagation
                      event.stopPropagation();
                      startBatchProcess(
                        rowData.corpus_id,
                        rowData.corpus_name,
                        batchProcessButton
                      );
                    }
                  );
                  cell.appendChild(batchProcessButton);
                } else {
                  cell.textContent = "Completed";
                  cell.classList.add("process_status");
                }
              } else if (key === "display_corpus_name") {
                cell.textContent =
                  value.charAt(0).toUpperCase() + value.slice(1);
                cell.setAttribute(
                  "title",
                  "Created: " + rowData.create_corpus_date
                );
                cell.classList.add("corpus_class");
                cell.addEventListener("click", function () {
                  goToIcorpus(rowData.index_name, rowData.index_type);
                });
              } else if (key === "corpus_file_count") {
                cell.classList.add("corpus_file");
                cell.textContent = value.toString();
              } else if (key === "process_doc_count") {
                cell.classList.add("process_doc");
                cell.textContent = value.toString();
              } else if (key === "failure_doc_count") {
                cell.classList.add("failure_doc");
                cell.textContent = value.toString();
              } else if (key === "own_corpus") {
                if (value == "true") {
                  var button = document.createElement("button");
                  button.innerHTML = `<i class="material-icons" id ="delete_icon">&#xe872;</i>`;
                  button.classList.add("delete_corpus");
                  cell.appendChild(button);
                  cell.addEventListener("click", function (event) {
                    //added the event.stopPropagation
                    event.stopPropagation();
                    deleteCorpus(rowData.corpus_id);
                  });
                } else if (value == "false") {
                  var button = document.createElement("button");
                  button.innerHTML = `<i class="material-icons" id ="disabled_icon">&#xe872;</i>`;
                  button.classList.add("delete_corpus");
                  button.setAttribute("disabled", true);
                  cell.appendChild(button);
                }
              } else {
                cell.textContent = value.toString();
              }
              row.appendChild(cell);
            }
          });
          tbody.appendChild(row);
        });
      }
    }
  });
};
