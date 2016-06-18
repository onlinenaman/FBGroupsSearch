package vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;

import model.Post;

import org.codehaus.jackson.annotate.JsonManagedReference;

@XmlRootElement
public class PostVO {
	
	public PostVO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public PostVO(Post account) {
		id = account.getId();
		message = account.getMessage();
		updated_time = account.getUpdated_time();
	}
	
	private String id, message, updated_time;
		
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getUpdated_time() {
		return updated_time;
	}

	public void setUpdated_time(String updated_time) {
		this.updated_time = updated_time;
	}
	
} 