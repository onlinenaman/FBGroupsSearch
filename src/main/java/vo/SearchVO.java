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
public class SearchVO {
	
	public SearchVO() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	private String searchString, updated_time;
		
	public String getMessage() {
		return searchString;
	}

	public void setMessage(String message) {
		this.searchString = message;
	}

	public String getUpdated_time() {
		return updated_time;
	}

	public void setUpdated_time(String updated_time) {
		this.updated_time = updated_time;
	}
	
} 