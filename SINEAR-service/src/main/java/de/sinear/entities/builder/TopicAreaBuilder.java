package de.sinear.entities.builder;

import org.apache.commons.lang3.builder.Builder;


import de.sinear.entities.TopicArea;

public class TopicAreaBuilder implements Builder<TopicArea>{

	private TopicArea topicArea;
	
	public TopicAreaBuilder(){
		
		topicArea = new TopicArea();
	}
	
	public TopicAreaBuilder name(String name) {
		this.topicArea.setName(name);
		return this;
	}
	
	@Override
	public TopicArea build() {
		
		return topicArea;
	}

	
}
