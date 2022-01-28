import "./CustomCard.css"

export default (props) => {
  return (
      <div class="col-lg-6 col-md-12">
        <div class="card" id="customCard">
          <div class="card-content">
            <div class="card-body cleartfix">
              <div class="media align-items-stretch">
                <div class="align-self-center">
                  <h1 class="mr-2" id="fontColors">R$ {props.children}</h1>
                </div>
                <div class="media-body">
                  <h4  id="fontColors">{props.title}</h4>
                  <span id="fontColors">{props.subTitle}</span>
                </div>
                <div class="align-self-center">
                  <i class={props.icon}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
