import "./CustomCard.css"

export default (props) => {
  return (
    <div class="col-lg-6 col-md-12">
      <div class="card">
        <div class="card-content">
          <div class="card-body cleartfix">
            <div class="media align-items-stretch">
              <div class="align-self-center">
                <h1 class="mr-2">R$ {props.children}</h1>
              </div>
              <div class="media-body">
                <h4>{props.title}</h4>
                <span>{props.subTitle}</span>
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
